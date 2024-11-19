// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/utils/Strings.sol"; // for error specification
import "./CSToken.sol";

contract InsuranceCompany {
    CSToken public token;
    mapping(string => bool) private validPolicyTypes;
    uint256 timestamp = block.timestamp; // current time as timestamp

    constructor(CSToken _token) {
        token = _token;
        validPolicyTypes["Travel"] = true;
        validPolicyTypes["Property"] = true;
        validPolicyTypes["Life"] = true;
    }
    // If User 1 does not have tokens to begin with to fulfill the max pool value, shdnt be allowed to create policy
    modifier checkEnoughTokenBal(uint256 maxPoolValue) {
        require(token.balanceOf(msg.sender) >= maxPoolValue, 
                string(
                abi.encodePacked(
                    "You currently have ", 
                    Strings.toString(token.balanceOf(msg.sender)), 
                    " tokens, which is not enough to create a policy with max pool value of ", 
                    Strings.toString(maxPoolValue), 
                    " tokens."
                )
            ));
        _;
    }

    // Modifier to check if the policy type is valid based on pre-defined 3 policy types
    modifier validPolicyType(string memory _policyType) {
        require(validPolicyTypes[_policyType], "Invalid policy type");
        _;
    }

    modifier higherClaimBackRate(uint256 claimBackRate, address lister) {
        require(claimBackRate > token.getUserConversionRate(lister), "Your claim back rate should be higher than your conversion rate");
        _;
    }

    modifier isListable(uint256 policyId) {
        Policy storage policy = policies[policyId];
        require (policy.currPoolValue + policy.minStake <= policy.maxPoolValue, "You cannot list this policy!");
        _;
    }

    /* Added in creation Time + coverage period to replace active */
    struct Policy {
        uint256 policyId;
        string policyName;
        string policyType;
        uint256 claimBackRate;
        uint256 maxPoolValue;
        uint256 currPoolValue;
        uint256 minStake;
        uint256 creationTime;
        uint coveragePeriod;
        address creator;
        bool listed;
    }

   
    uint256 public policyCount;

    mapping(uint256 => Policy) policies;
    // Mapping from lister's address to a list of policy IDs
    mapping(address => uint256[]) public listerPolicies;


    event PolicyCreated(uint256 policyId, string policyName, address creator);
    event PolicyClaimed(uint256 policyId, uint256 claimValue); 
    // Define an event to log policy details
    event PolicyDetails(
        uint256 policyId,
        string policyName,
        string policyType,
        uint256 claimBackRate,
        uint256 maxPoolValue,
        uint256 currPoolValue,
        uint256 minStake,
        uint256 creationTime,
        uint coveragePeriod,
        address creator,
        bool listed
    );

    event PolicyListed(uint256 policyId, string listed);
    event PolicydeListed(uint256 policyId, string delisted);

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
            if (policies[i].creator == msg.sender) {
                sum += calculateNetClaimValue(policies[i]);
            }
        }
        return sum;
    }

    // Anyone who has enough tokens > max pool value & not at risk of bankruptcy from claim back rate will be able to create a policy
    function createNewPolicy(
        string memory _policyName,
        string memory _policyType, 
        uint256 _claimBackRate, // r we gonna require claim back rate > conversion rate?
        uint256 _maxPoolValue,
        uint256 _minStake, // min amount of tokens (premium) that a buyer must pay to get a share of being insured under the policy
        uint _coveragePeriod // default this to days
    ) external checkEnoughTokenBal(_maxPoolValue) validPolicyType(_policyType) higherClaimBackRate(_claimBackRate, msg.sender){
        require(
           
            token.balanceOf(address(msg.sender)) > calculateAllNetClaimValue(),
            "Risk of bankruptcy: reduce the max pool value for this policy"
            // Check against the balance of the msg.sender because he is the one who owns the tokens initially rather than the balance of insuranceCom contract?
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
            creationTime: block.timestamp,              // track creation time
            coveragePeriod: _coveragePeriod * 1 days, //
            creator: msg.sender, 
            listed: false
        });


        // Track the policy ID under the lister's address
        listerPolicies[msg.sender].push(policyCount);

        emit PolicyCreated(policyCount, _policyName, msg.sender);
    }

    // Function to get the details of all policies created by a lister either from policy side or marketplace
    function getListerPolicyDetails(address _lister) public 
    {
        uint256[] memory policyIds = listerPolicies[_lister];
        require(policyIds.length > 0, "Lister has not created any policies");

        for (uint256 i = 0; i < policyIds.length; i++) {
            uint256 policyId = policyIds[i];
            Policy memory policy = policies[policyId];

            // Emit the event with pretty data
            emit PolicyDetails(
                policy.policyId,
                policy.policyName,
                policy.policyType,
                policy.claimBackRate,
                policy.maxPoolValue,
                policy.currPoolValue,
                policy.minStake,
                policy.creationTime,
                policy.coveragePeriod,
                policy.creator,
                policy.listed
            );
        }
    }
            

    // For usage by marketplace
    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        require(policyId > 0 && policyId <= policyCount, "Invalid policy ID");
        return policies[policyId];
    }

    function updatePolicyPoolValue(uint256 policyId, uint256 newPoolValue)
        external
    {
        Policy storage policy = policies[policyId];
        require(block.timestamp <= (policy.creationTime + policy.coveragePeriod), "Policy is not active"); // check within active period
        require(policy.policyId == policyId, "Policy not found");

        policy.currPoolValue = newPoolValue;

        // can emit an event here
    }

    
    function _listPolicy(uint256 policyId) public isListable(policyId) {
        Policy storage policy = policies[policyId];
        require(policy.listed == false, "Policy is already listed");
        changePolicyListedStatus(policyId);
        emit PolicyListed(policyId, "Policy has been listed successfully!");
    }

    function _deListPolicy(uint256 policyId) public {
        Policy storage policy = policies[policyId];
        require(policy.listed == true, "Policy is already delisted");
        changePolicyListedStatus(policyId);
        emit PolicydeListed(policyId, "Policy has been delisted successfully!");
    }

    function changePolicyListedStatus(uint256 policyId) internal {
        Policy storage policy = policies[policyId];
        require(policy.policyId == policyId, "Policy not found");

        policy.listed = !policy.listed;
    }
}
