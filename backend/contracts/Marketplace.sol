// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./CSToken.sol";
import "./InsuranceCompany.sol";
import "./.deps/github/0x00pluto/solidity-datetime/contracts/DateTime.sol"; // for date time
import "./.deps/npm/@openzeppelin/contracts/utils/Strings.sol"; // for error specification

contract Marketplace {
    CSToken token;
    InsuranceCompany company;
    uint currentTimestamp = block.timestamp;

    constructor(CSToken _token, InsuranceCompany _company) {
        token = _token;
        company = _company;
    }

    // Checks that buyer's coverage period has not ended for them to be able to make claims on their policy
    modifier isActive(uint256 policyId) {
        bool active = false;
        for (uint256 i = 0; i < policyHolders[msg.sender].length; i++) {
            if (policyHolders[msg.sender][i].boughtPolicy.policyId == policyId) {
                BuyerPolicy memory bp = policyHolders[msg.sender][i];
                require(bp.coverageEndTimestamp > block.timestamp);
                active = true;
                break;
            }
        }
        require(active, "This policy is not active.");
        _;
    }

    // Policy lister must own a policy to be able to list that specific policy Id
    modifier mustOwnPolicy(uint256 policyId) {
        InsuranceCompany.Policy memory policy = company.getPolicy(policyId);
        require(msg.sender == policy.creator, "You do not own this policy");
        _;
    }

    // Policy buyer must have bought a policy to view their bought policies
    modifier isPolicyHolder() {
        require(policyHolders[msg.sender].length > 0, "You are not a policyholder");
        _;
    }


    struct Date {
        uint256 year;
        uint256 month;
        uint256 day;
    }

    // Struct to hold all information about a policy bought by a buyer, including coverage details
    struct BuyerPolicy {
        InsuranceCompany.Policy boughtPolicy; // The full policy details
        uint256 coverageStartTimestamp; // Coverage start timestamp (when the buyer purchases)
        uint256 coverageEndTimestamp; // Coverage end timestamp (calculated based on coverage period)
        Date coverageStartDate; // Coverage start date (human-readable)
        Date coverageEndDate; // Coverage end date (human-readable)
        uint256 ownedCSTokens;
    }

    event TokensListed(address indexed creator, uint256 amount);
    event PolicyBought(
        address indexed buyer,           
        uint256 indexed policyId, 
        Date coverageStartTimestamp,   
        Date coverageEndTimestamp,   
        uint256 ownedCSTokens 
    );
    event PolicyClaimed(uint256 policyId, uint256 claimAmount);

    mapping(uint256 => uint256) public policyDeposits; // Tracks tokens authorized for the marketplace to manage and transfer to policy buyers for each listed policy

    mapping(address => BuyerPolicy[]) public policyHolders;   // Tracks bought policies associated with a policy buyer

    // For policy listers to list a policy
    function listPolicy(uint256 policyId) public mustOwnPolicy(policyId) {
        InsuranceCompany.Policy memory listedPolicy = company.getPolicy(policyId);

        /* Check if the policy creator has authorized the Marketplace to manage tokens up to the policy's max pool value. 
        If not, approval is required to enable the transer of CS tokens to policy buyers when they purchase a share of the listed policy */
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
        bool success = token.transferFrom(
            msg.sender,
            address(this),
            listedPolicy.maxPoolValue
        );
        require(success, "Token transfer failed.");

        // Track the deposit for this policy
        policyDeposits[policyId] = listedPolicy.maxPoolValue;

        emit TokensListed(msg.sender, listedPolicy.maxPoolValue);

        company._listPolicy(policyId);
    }

    // For everyone to view all listed policies
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
        require(
            listedCount > 0,
            "There are currently no listed policies to buy"
        );

        // Create an array for the listed policies
        InsuranceCompany.Policy[] memory listed = new InsuranceCompany.Policy[](
            listedCount
        );
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
                    coveragePeriod: policy.coveragePeriod,
                    creator: policy.creator,
                    listed: policy.listed
                });
                index++;
            }
        }

        return listed;
    }

    // For policy buyers to buy a listed policy. Minimally, they must provide an amount that is equivalent to the min.stake of the policy
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
        (
            coverageStartDate.year,
            coverageStartDate.month,
            coverageStartDate.day
        ) = DateTime.timestampToDate(coverageStartTimestamp);
        
        Date memory coverageEndDate;
        (
            coverageEndDate.year,
            coverageEndDate.month,
            coverageEndDate.day
        ) = DateTime.timestampToDate(coverageEndTimestamp);

        // Create a new BuyerPolicy struct with coverage dates
        BuyerPolicy memory buyerPolicy = BuyerPolicy({
            boughtPolicy: policy, // The Policy that the buyer is purchasing
            coverageStartTimestamp: coverageStartTimestamp,
            coverageEndTimestamp: coverageEndTimestamp,
            coverageStartDate: coverageStartDate,
            coverageEndDate: coverageEndDate,
            ownedCSTokens: msg.value / token.getUserConversionRate(policy.creator)
        });

        // Ensure that marketplace has enough tokens approved to it by the policy lister to transfer to the buyer
        require(policyDeposits[policyId] >= msg.value / token.getUserConversionRate(policy.creator), "Insufficient tokens left to provide ");

        // Transfer tokens from Marketplace to buyer
        token.transfer(msg.sender, msg.value / token.getUserConversionRate(policy.creator));

        // Deduct from the policy deposit
        policyDeposits[policyId] -= msg.value / token.getUserConversionRate(policy.creator);

        // Add the buyer's policy to their list of purchased policies
        policyHolders[msg.sender].push(buyerPolicy);

        company.updatePolicyPoolValue(
            policyId,
            policy.currPoolValue + (msg.value / token.getUserConversionRate(policy.creator))
        );

        // Auto-delisting the policy if the policy no longer has sufficient CS tokens to meet the min.stake required for buyers to buy into the policy.
        if (policy.maxPoolValue - policy.currPoolValue < policy.minStake) {
            delistPolicy(policyId);
        }

        emit PolicyBought(
            msg.sender,
            policyId,
            coverageStartDate,
            coverageEndDate,
            policy.minStake
        );
    }

    // For policy buyers to make a claim on their bought policy, where their coverage period has not ended
    function claimPolicy(uint256 policyId) external isPolicyHolder isActive(policyId) {
        bool ownsPolicy = false;
        uint256 index = 0;
        for (uint256 i = 0; i < policyHolders[msg.sender].length; i++) {
            if (policyHolders[msg.sender][i].boughtPolicy.policyId == policyId) {
                ownsPolicy = true;
                index = i;
                break;
            }
        }

        require(ownsPolicy == true, "You have not bought this policy!");

        uint256 ownedTokens = policyHolders[msg.sender][index].ownedCSTokens;
        require(ownedTokens > 0, "You do not own tokens for this policy!");
        
        InsuranceCompany.Policy memory policy = company.getPolicy(policyId);

        // Calculate the total claim amount in Wei based on the claim back rate
        uint256 totalClaimableWei = ownedTokens * policy.claimBackRate;

        // Transfer claim amount from policy creator's parked collateral to the policy buyer/claimer (ie.msg.sender in this case);
        token.transferCollateral(policy.creator, msg.sender, totalClaimableWei);

        // Burns the policy buyer's owned tokens after they have claimed
        token.burn(msg.sender, ownedTokens);

        // Remove the claimed policy from the buyer's bought policy
        removePolicy(msg.sender, index);

        // Emit event for successful claim
        emit PolicyClaimed(policyId, totalClaimableWei);
    }

    // Helper method to remove a claimed policy from the buyer's bought policies 
    function removePolicy(address policyHolder, uint256 index) internal {
        require(index < policyHolders[policyHolder].length, "Index out of bounds");

        // Swap the policy to be removed with the last policy in the array
        policyHolders[policyHolder][index] = policyHolders[policyHolder][policyHolders[policyHolder].length - 1];

        // Pop the last element
        policyHolders[policyHolder].pop();
    }

    // For a policy buyer to view all their bought policies
    function viewMyBoughtPolicies()
        external isPolicyHolder
        view
        returns (BuyerPolicy[] memory)
    {
        // Check if the caller has any active policies
        require(
            policyHolders[msg.sender].length > 0,
            "You don't own any policies"
        );

        // Create an array to store the complete BuyerPolicy structs (not just Policy)
        BuyerPolicy[] memory buyerPolicies = new BuyerPolicy[](
            policyHolders[msg.sender].length
        );

        // Loop through the buyer's policies and store the full BuyerPolicy struct
        for (uint256 i = 0; i < policyHolders[msg.sender].length; i++) {
            buyerPolicies[i] = policyHolders[msg.sender][i]; // Extract the full BuyerPolicy struct
        }

        return buyerPolicies; // Return the array of full BuyerPolicy structs
    }


    function delistPolicy(uint256 policyId) private {
        company._deListPolicy(policyId);
    }
}
