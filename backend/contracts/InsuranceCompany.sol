// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./.deps/npm/@openzeppelin/contracts/utils/Strings.sol"; // for error specification
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

    // Modifier to ensure that the policy creator has enough tokens to cover the max pool value of the policy, without exceeding their token balance
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

    // Modifier to check that the defined claim back rate in a new policy must be > than that of the initial user conversion rate defined
    modifier higherClaimBackRate(uint256 claimBackRate, address lister) {
        require(claimBackRate > token.getUserConversionRate(lister), "Your claim back rate should be higher than your conversion rate");
        _;
    }

    modifier isListable(uint256 policyId) {
        Policy storage policy = policies[policyId];
        require (policy.currPoolValue + policy.minStake <= policy.maxPoolValue, "You cannot list this policy!");
        _;
    }

    struct Policy {
        uint256 policyId;
        string policyName;
        string policyType;
        uint256 claimBackRate;
        uint256 maxPoolValue;
        uint256 currPoolValue;
        uint256 minStake;
        uint coveragePeriod;
        address creator;
        bool listed;
    }
   
    uint256 public policyCount;

    // Tracks the list of policies according to their policy Ids
    mapping(uint256 => Policy) policies;
   
    // Keeps track of the policy IDs created by each policy creator
    mapping(address => uint256[]) public listerPolicies;

    // Emit necessary events for policy creation, listing and delisting
    event PolicyCreated(uint256 policyId, string policyName, address creator);
    event PolicyListed(uint256 policyId, string listed);
    event PolicydeListed(uint256 policyId, string delisted);

    // Define an event to log policy details
    event PolicyDetails(
        uint256 policyId,
        string policyName,
        string policyType,
        uint256 claimBackRate,
        uint256 maxPoolValue,
        uint256 currPoolValue,
        uint256 minStake,
        uint coveragePeriod,
        address creator,
        bool listed
    );    

    event CheckSufficientCollateral(
        address indexed user,
        uint256 collateral,
        uint256 netClaimValue
    );

    function calculateNetClaimValue(Policy memory p)
        public
        pure
        returns (uint256)
    {
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

    // Anyone who has enough tokens > max pool value & not at risk of collateral bankruptcy from claim back rate will be able to create a policy
    function createNewPolicy(
        string memory _policyName,
        string memory _policyType, 
        uint256 _claimBackRate, 
        uint256 _maxPoolValue, // Max. amount of CS tokens allocated to policy by policy creator, which are transferred to the marketplace when the policy is listed.
        uint256 _minStake, // Min. amount of tokens (premium) that a buyer must pay to get a share of being insured under the policy
        uint _coveragePeriod // Specifies the coverage duration for a policy buyer, starting from the purchase date, in days.
    ) external checkEnoughTokenBal(_maxPoolValue) validPolicyType(_policyType) higherClaimBackRate(_claimBackRate, msg.sender){

        policyCount++;

        Policy memory createdPolicy = Policy({
            policyId: policyCount,
            policyName: _policyName,
            policyType: _policyType,
            claimBackRate: _claimBackRate,
            maxPoolValue: _maxPoolValue, 
            currPoolValue: 0,
            minStake: _minStake,
            coveragePeriod: _coveragePeriod * 1 days, // blockchain stores the coverage period in seconds
            creator: msg.sender, 
            listed: false
        });

        // Calculate the total net claim value of all existing policies
        uint256 totalNetClaimValue = calculateAllNetClaimValue();
        
        // Calculate the net claim value of the new policy (this will be added to the total claim value)
        uint256 newPolicyNetClaimValue = calculateNetClaimValue(createdPolicy);
        
        // Add the new policy's net claim value to the existing ones
        totalNetClaimValue += newPolicyNetClaimValue;

        // Get the policy creator's collateral
        uint256 collateral = token.getUserCollateral(msg.sender);

         // Check if the policy lister's collateral is enough to cover the total net claim value (existing + new policy) 
        require(
            collateral >= totalNetClaimValue,
            "Insufficient collateral: reduce the max pool value for this policy or top up more CS tokens to increase your collateral"
        );

        emit CheckSufficientCollateral(msg.sender, token.getUserCollateral(msg.sender), totalNetClaimValue);


        // Associate the policyId with the newly created policy in policies mapping
        policies[policyCount] = createdPolicy;
        // Track the policy ID under the lister's address
        listerPolicies[msg.sender].push(policyCount);

        emit PolicyCreated(policyCount, _policyName, msg.sender);
    }

    // Function to get the details of all policies created by a lister
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
                policy.coveragePeriod,
                policy.creator,
                policy.listed
            );
        }
    }
            
    // To easily retrieve a policy based on its policy details
    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        require(policyId > 0 && policyId <= policyCount, "Invalid policy ID");
        return policies[policyId];
    }

    // For marketplace to update current pool value of policy when a policy buyer buys a listed policy
    function updatePolicyPoolValue(uint256 policyId, uint256 newPoolValue) external
    {
        Policy storage policy = policies[policyId];
        require(policy.policyId == policyId, "Policy not found");

        policy.currPoolValue = newPoolValue;

        // can emit an event here
    }

    // Allow policy listing from marketplace
    function _listPolicy(uint256 policyId) external isListable(policyId) {
        Policy storage policy = policies[policyId];
        require(policy.listed == false, "Policy is already listed");
        changePolicyListedStatus(policyId);
        emit PolicyListed(policyId, "Policy has been listed successfully!");
    }

    // Allow policy deListing from marketplace
    function _deListPolicy(uint256 policyId) external {
        Policy storage policy = policies[policyId];
        require(policy.listed == true, "Policy is already delisted");
        changePolicyListedStatus(policyId);
        emit PolicydeListed(policyId, "Policy has been delisted successfully!");
    }

    // Change the policy listed status internally 
    function changePolicyListedStatus(uint256 policyId) internal {
        Policy storage policy = policies[policyId];
        require(policy.policyId == policyId, "Policy not found");

        policy.listed = !policy.listed;
    }
}
