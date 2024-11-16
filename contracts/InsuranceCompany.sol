// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // for error specification
import "https://github.com/0x00pluto/solidity-datetime/blob/master/contracts/DateTime.sol"; // for date time

import "./CSToken.sol";

contract InsuranceCompany is Ownable {
    CSToken public token;
    mapping(string => bool) private validPolicyTypes;
    uint256 timestamp = block.timestamp; // current time as timestamp

    constructor(CSToken _token) Ownable(msg.sender) {
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
        Date creationDate;     
        Date coverageEndDate;
        address creator;
        bool listed;
    }

    struct Date {
        uint256 year;
        uint256 month;
        uint256 day;
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

    // Anyone who has enough tokens > max pool value & not at risk of bankruptcy from claim back rate will be able to create a policy
    function createNewPolicy(
        string memory _policyName,
        string memory _policyType, 
        uint256 _claimBackRate, // r we gonna require claim back rate > conversion rate?
        uint256 _maxPoolValue,
        uint256 _minStake, // min amount of tokens (premium) that a buyer must pay to get a share of being insured under the policy
        uint _coveragePeriod // default this to days
    ) external checkEnoughTokenBal(_maxPoolValue) validPolicyType(_policyType) {
        require(
            // I think there is some logic error here on address(this)) being the one to check against
      

            /* If we are checking based on insurance company contract balance, it will always be 0 at the start,
               and this condition would always fail
               cuz only after u create a policy then you would transfer tokens to this contract.
               At the same time, need to have a mapping to track the max pool value of policies created by specific users.

               Ie. User 1 create policy 1 with 3k tokens, User 2 create policy 2 with 5k tokens,
                   InsuranceCompany contract would have 8k tokens balance, but it would know 
                   that how many tokens each user has so based on that then on marketplace side
                   it will know how to segregate the tokens according to the creators.

            */

            // there needs to be a token transfer to this contract as well ideally (to reduce the max pool from the token owner)

            token.balanceOf(address(msg.sender)) > calculateAllNetClaimValue(),
            "Risk of bankruptcy: reduce the max pool value for this policy"
        );

        policyCount++;
        Date memory creationDate;
        (creationDate.year, creationDate.month, creationDate.day) = DateTime.timestampToDate(timestamp);
        // Call timestampToDate to get year, month, and day and convert to Date struct to prevent stack too deep error
        uint256 coverageEndTimestamp = timestamp + (_coveragePeriod * 1 days);
        Date memory coverageEndDate;
        (coverageEndDate.year, coverageEndDate.month, coverageEndDate.day) = DateTime.timestampToDate(coverageEndTimestamp);


        policies[policyCount] = Policy({
            policyId: policyCount,
            policyName: _policyName,
            policyType: _policyType,
            claimBackRate: _claimBackRate,
            maxPoolValue: _maxPoolValue, 
            currPoolValue: 0, /* correct me if wrong, curr Pool value should be based on initial max pool value,
                                 and then decremented as buyers start to purchase the policy? */
            minStake: _minStake,
            creationTime: block.timestamp,              // track creation time
            coveragePeriod: _coveragePeriod * 1 days, 
            creationDate: creationDate,
            coverageEndDate: coverageEndDate, // think we discussed that time to make it 1 day [prob is blockchain stores as seconds]
            creator: msg.sender, 
            listed: false
        });

        emit PolicyCreated(policyCount, _policyName, msg.sender);
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        require(policyId > 0 && policyId <= policyCount, "Invalid policy ID");
        return policies[policyId];
    }

    /* A bit lost on needing to add collateral here, i thought adding collateral was to add to no of tokens original owner has?
       Unless it is to add to the max pool value?  Is this still needed?*/
    function addCollateral(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        // emit TokensBought(msg.sender, amount);
    }

    /* Does it make sense to have update policy pool? 
       Usually once the policy is listed, isnt the total insurance coverage/pool fixed? Or are u saying after top up CS tokens, */
    function updatePolicyPoolValue(uint256 policyId, uint256 newPoolValue)
        external
    {
        Policy storage policy = policies[policyId];
        require(block.timestamp <= (policy.creationTime + policy.coveragePeriod), "Policy is not active"); // check within active period
        require(policy.policyId == policyId, "Policy not found");

        policy.currPoolValue = newPoolValue;

        // can emit an event here
    }

    /* Im guessing this should be a private function as previously discussed where we check
       if there is enough tokens left to fulfill the next min token transaction 
       Ie. if curr pool value = 90, min stake = 100, shd delist but remain active */
    function changePolicyListedStatus(uint256 policyId) external {
        Policy storage policy = policies[policyId];
        require(policy.policyId == policyId, "Policy not found");

        policy.listed = !policy.listed;
    }
}
