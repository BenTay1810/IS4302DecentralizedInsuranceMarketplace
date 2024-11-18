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

    mapping(address => InsuranceCompany.Policy[]) public policyHolders;

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



    function listPolicy(uint256 policyId) public mustOwnPolicy(policyId) {
        // Date memory creationDate;
        // (creationDate.year, creationDate.month, creationDate.day) = DateTime.timestampToDate(timestamp);
        // // Call timestampToDate to get year, month, and day and convert to Date struct to prevent stack too deep error
        // uint256 coverageEndTimestamp = timestamp + (_coveragePeriod * 1 days);
        // Date memory coverageEndDate;
        // (coverageEndDate.year, coverageEndDate.month, coverageEndDate.day) = DateTime.timestampToDate(coverageEndTimestamp);
        company._listPolicy(policyId);
    }

    function viewListedPolicies()
        external
        view
        returns (InsuranceCompany.Policy[] memory)
    {
        uint256 totalPolicies = company.policyCount();
        InsuranceCompany.Policy[] memory listed = new InsuranceCompany.Policy[](
            totalPolicies
        );
        uint256 listedCount = 0;

        for (uint256 i = 1; i <= totalPolicies; i++) {
            InsuranceCompany.Policy memory policy = company.getPolicy(i);
            if (policy.listed) {
                listed[listedCount] = policy;
                listedCount++;
            }
        }
        return listed;
    }

    function viewMyActivePolicies()
        external
        view
        returns (InsuranceCompany.Policy[] memory)
    {
        return policyHolders[msg.sender];
    }

    function buyPolicy(uint256 policyId) external payable {
        // Fetch the policy details
        InsuranceCompany.Policy memory policy = company.getPolicy(policyId);
        require(policy.listed == true, "You cannot buy a policy that has not been listed!");

        uint256 requiredValue = policy.minStake * token.getUserConversionRate();
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

       
        // These are people who have bought policies
        policyHolders[msg.sender].push(policy);

        company.updatePolicyPoolValue(
            policyId,
            policy.currPoolValue + policy.minStake
        );

         // Auto-delisting after updating policy pool value
        if (policy.maxPoolValue - policy.currPoolValue < policy.minStake) {
            delistPolicy(policyId);
        }

    }

    function delistPolicy(uint256 policyId) private {
        company._deListPolicy(policyId);
    }
}
