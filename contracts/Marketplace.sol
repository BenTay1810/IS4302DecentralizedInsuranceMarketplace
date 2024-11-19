// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CSToken.sol";
import "./InsuranceCompany.sol";
import "https://github.com/0x00pluto/solidity-datetime/blob/master/contracts/DateTime.sol"; // for date time
import "@openzeppelin/contracts/utils/Strings.sol"; // for error specification


contract Marketplace {
    CSToken token;
    InsuranceCompany company;
    uint currentTimestamp = block.timestamp;

    constructor(CSToken _token, InsuranceCompany _company) {
        token = _token;
        company = _company;
    }

    modifier isActive(uint256 policyId) {
        InsuranceCompany.Policy memory policy = company.getPolicy(policyId);
        require(currentTimestamp <= (policy.creationTime + policy.coveragePeriod));
        _;
    }

    modifier mustOwnPolicy(uint256 policyId) {
        InsuranceCompany.Policy memory policy = company.getPolicy(policyId);
        require(msg.sender == policy.creator, "You do not own this policy");
        _;
    }

    struct Date {
        uint256 year;
        uint256 month;
        uint256 day;
    }

    // Struct to hold all information about a policy bought by a buyer, including coverage details
    struct BuyerPolicy {
        InsuranceCompany.Policy boughtPolicy;           // The full policy details
        uint256 coverageStartTimestamp; // Coverage start timestamp (when the buyer purchases)
        uint256 coverageEndTimestamp;   // Coverage end timestamp (calculated based on coverage period)
        Date coverageStartDate;         // Coverage start date (human-readable)
        Date coverageEndDate;           // Coverage end date (human-readable)
        uint256 ownedCSTokens;
    }

    event TokensListed(address indexed creator, uint256 amount);
    mapping(uint256 => uint256) public policyDeposits; // Tracks tokens deposited for each policy
    mapping(address => BuyerPolicy[]) public policyHolders;

    function listPolicy(uint256 policyId) public mustOwnPolicy(policyId) {
        InsuranceCompany.Policy memory listedPolicy = company.getPolicy(policyId);

        uint256 balance = token.balanceOf(msg.sender);
        require(balance >= listedPolicy.maxPoolValue, "Insufficient token balance.");

        // Check if the user has approved the Marketplace to spend tokens on their behalf
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(
            allowance >= listedPolicy.maxPoolValue,
            string(
                abi.encodePacked(
                    "You need to approve the marketplace to spend ", 
                    Strings.toString(listedPolicy.maxPoolValue), 
                    " max pool value tokens on your behalf for this policy."
                )
            )
        );

        // Transfer tokens directly to the Marketplace contract
        bool success = token.transferFrom(msg.sender, address(this), listedPolicy.maxPoolValue);
        require(success, "Token transfer failed.");

        // Track the deposit for this policy
        policyDeposits[policyId] = listedPolicy.maxPoolValue;

        emit TokensListed(msg.sender, listedPolicy.maxPoolValue);

        company._listPolicy(policyId);
    }

    function viewListedPolicies() external view returns (InsuranceCompany.Policy[] memory)
    {
        uint256 totalPolicies = company.policyCount();
        uint256 listedCount = 0;

        // Count listed policies
        for (uint256 i = 1; i <= totalPolicies; i++) {
            InsuranceCompany.Policy memory policy = company.getPolicy(i);
            if (policy.listed) {
                listedCount++;
            }
        }

        // Ensure at least one listed policy exists
        require(listedCount > 0, "There are currently no listed policies to buy");

        // Create an array for the listed policies
        InsuranceCompany.Policy[] memory listed = new InsuranceCompany.Policy[](listedCount);
        uint256 index = 0;

        // Add the listed policies to the array
        for (uint256 i = 1; i <= totalPolicies; i++) {
            InsuranceCompany.Policy memory policy = company.getPolicy(i);
            if (policy.listed) {
                listed[index] = InsuranceCompany.Policy({
                    policyId: policy.policyId,
                    policyName: policy.policyName,
                    policyType: policy.policyType,
                    claimBackRate: policy.claimBackRate,
                    maxPoolValue: policy.maxPoolValue,
                    currPoolValue: policy.currPoolValue,
                    minStake: policy.minStake,
                    creationTime: policy.creationTime,
                    coveragePeriod: policy.coveragePeriod,
                    creator: policy.creator,
                    listed: policy.listed
                });
                index++;
            }
        }

        return listed;
    }

    // add amount of tokens they wanna buy?
    function buyPolicy(uint256 policyId) external payable {
        // Fetch the policy details
        InsuranceCompany.Policy memory policy = company.getPolicy(policyId);
        require(policy.listed == true, "You cannot buy a policy that has not been listed!");
        require(policy.creator != msg.sender, "You cannot buy your own policy");

        // Get required premium based on policy creator/lister's conversion rate
        uint256 requiredValue = policy.minStake * token.getUserConversionRate(policy.creator);
        require(
            msg.value >= requiredValue,
            string(
                abi.encodePacked(
                    "You need to pay at least the premium of ", 
                    Strings.toString(requiredValue), 
                    " wei, but provided ", 
                    Strings.toString(msg.value), 
                    " wei."
                )
            )
        );

        // Ensure that the policy has enough capacity for more buyers
        require(
            policy.maxPoolValue > policy.currPoolValue,
            "Policy capacity exceeded"
        );

        // Calculate coverage start and end timestamps
        uint256 coverageStartTimestamp = block.timestamp;
        uint256 coverageEndTimestamp = block.timestamp + policy.coveragePeriod;

        Date memory coverageStartDate;
        (coverageStartDate.year, coverageStartDate.month, coverageStartDate.day) = DateTime.timestampToDate(coverageStartTimestamp);
        Date memory coverageEndDate;
        (coverageEndDate.year, coverageEndDate.month, coverageEndDate.day) = DateTime.timestampToDate(coverageEndTimestamp);


        // Create a new BuyerPolicy struct with coverage dates
        BuyerPolicy memory buyerPolicy = BuyerPolicy({
            boughtPolicy: policy,  // The Policy that the buyer is purchasing
            coverageStartTimestamp: coverageStartTimestamp,
            coverageEndTimestamp: coverageEndTimestamp,
            coverageStartDate: coverageStartDate,
            coverageEndDate: coverageEndDate,
            ownedCSTokens: policy.minStake
        });


        // Ensure the policy has enough tokens deposited
        require(policyDeposits[policyId] >= requiredValue, "Insufficient tokens in policy deposit.");

        // Transfer tokens from Marketplace to buyer
        token.transfer(msg.sender, requiredValue);

        // Deduct from the policy deposit
        policyDeposits[policyId] -= requiredValue;

        // Add the buyer's policy to their list of purchased policies
        policyHolders[msg.sender].push(buyerPolicy);


        company.updatePolicyPoolValue(
            policyId,
            policy.currPoolValue + policy.minStake
        );

         // Auto-delisting after updating policy pool value
        if (policy.maxPoolValue - policy.currPoolValue < policy.minStake) {
            delistPolicy(policyId);
        }

    }

    function viewMyBoughtPolicies() external view returns (BuyerPolicy[] memory) 
    {
        // Check if the caller has any active policies
        require(policyHolders[msg.sender].length > 0, "You don't own any policies");

        // Create an array to store the complete BuyerPolicy structs (not just Policy)
        BuyerPolicy[] memory buyerPolicies = new BuyerPolicy[](policyHolders[msg.sender].length);

        // Loop through the buyer's policies and store the full BuyerPolicy struct
        for (uint256 i = 0; i < policyHolders[msg.sender].length; i++) {
            buyerPolicies[i] = policyHolders[msg.sender][i]; // Extract the full BuyerPolicy struct
        }

        return buyerPolicies;  // Return the array of full BuyerPolicy structs
    }

    function delistPolicy(uint256 policyId) private {
        company._deListPolicy(policyId);
    }
}