// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CIToken.sol";
import "./InsuranceCompany.sol";

contract Marketplace {
    CIToken token;
    InsuranceCompany company;

    constructor(CIToken _token, InsuranceCompany _company) {
        token = _token;
        company = _company;
    }

    mapping(address => InsuranceCompany.Policy[]) public policyHolders;

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

        uint256 requiredValue = policy.minStake * token.conversionRate();
        require(
            msg.value >= requiredValue,
            "You need to pay at least the premium"
        );

        // Ensure that the policy has enough capacity for more buyers
        require(
            policy.maxPoolValue > policy.currPoolValue,
            "Policy capacity exceeded"
        );

        if (policy.maxPoolValue - policy.currPoolValue < policy.minStake) {
            _delistPolicy(policyId);
        }

        policyHolders[msg.sender].push(policy);

        company.updatePolicyPoolValue(
            policyId,
            policy.currPoolValue + policy.minStake
        );
    }

    function _delistPolicy(uint256 policyId) private {
        company.changePolicyListedStatus(policyId);
    }
}
