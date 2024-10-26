// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import "./CIToken.sol";

contract InsuranceCompany is Ownable {
    CIToken public token;

    constructor(CIToken _token) Ownable(msg.sender) {
        token = _token;
    }

    struct Policy {
        uint256 policyId;
        string policyName;
        string policyType;
        uint256 claimBackRate;
        uint256 maxPoolValue;
        uint256 currPoolValue;
        uint256 minStake;
        address creator;
        bool listed;
        bool active;
    }

    uint256 public policyCount;

    mapping(uint256 => Policy) policies;

    event PolicyCreated(uint256 policyId, string policyName, address creator);
    event PolicyClaimed(uint256 policyId, uint256 claimValue);

    function calculateNetClaimValue(Policy memory p)
        public
        pure
        returns (uint256)
    {
        if (p.claimBackRate > 1) {
            return (p.claimBackRate - 1) * p.maxPoolValue;
        }
        return p.claimBackRate * p.maxPoolValue;
    }

    function calculateAllNetClaimValue() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 1; i <= policyCount; i++) {
            sum += calculateNetClaimValue(policies[i]);
        }
        return sum;
    }

    function createNewPolicy(
        string memory _policyName,
        string memory _policyType,
        uint256 _maxPoolValue,
        uint256 _minStake,
        uint256 _claimBackRate
    ) external onlyOwner {
        require(
            token.balanceOf(address(this)) > calculateAllNetClaimValue(),
            "Risk of bankruptcy: reduce the max pool value for this policy"
        );

        policyCount++;
        policies[policyCount] = Policy({
            policyId: policyCount,
            policyName: _policyName,
            policyType: _policyType,
            claimBackRate: _claimBackRate,
            maxPoolValue: _maxPoolValue,
            currPoolValue: 0,
            minStake: _minStake,
            creator: msg.sender,
            listed: false,
            active: true
        });

        emit PolicyCreated(policyCount, _policyName, msg.sender);
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        require(policyId > 0 && policyId <= policyCount, "Invalid policy ID");
        return policies[policyId];
    }

    function addCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        // emit TokensBought(msg.sender, amount);
    }

    function updatePolicyPoolValue(uint256 policyId, uint256 newPoolValue)
        external
    {
        Policy storage policy = policies[policyId];
        require(policy.active, "Policy is not active");
        require(policy.policyId == policyId, "Policy not found");

        policy.currPoolValue = newPoolValue;

        // can emit an event here
    }

    function changePolicyListedStatus(uint256 policyId) external {
        Policy storage policy = policies[policyId];
        require(policy.policyId == policyId, "Policy not found");

        policy.listed = !policy.listed;
    }
}
