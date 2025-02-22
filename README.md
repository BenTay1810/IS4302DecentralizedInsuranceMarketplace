# IS4302 - ChainSure: Decentralized Insurance Marketplace

## White Paper & Architecture and Design Document
View our Design Document [here](https://docs.google.com/document/d/1DMRLv81oIaTPXTWZ_UbW6wftkhTvm5swFjtCNi_js1M/edit?usp=sharing)


## Stakeholders Involved
Policy Listers (Insurers) & Policy Buyers (Policy Holders)

# Remix Test Run

## Deployment phase
Deploy all contracts (CSToken.sol, InsuranceCompany.sol, Marketplace.sol) with the address `0xdD870fA1b7C4700F2BD7f44238821C26f7392148`.
This deployment phase is meant to simulate all the contracts already being deployed on the blockchain so that they can be used by policy listers and policy buyers 

3 contracts:
1) CSToken.sol
2) InsuranceCompany.sol
3) Marketplace.sol

#### CSToken.sol
- Used by policy listers to mint ChainSure (CS) tokens by converting an equivalent amount of wei to CS tokens based on a user-defined conversion rate
- This enables policy listers to stake a certain amount of collateral to their minted cs tokens using the formula: `Minted CS tokens * Conversion Rate = Staked Collateral`.

#### InsuranceCompany.sol
- Once a policy lister has minted CS tokens, they can then stake their CS tokens by specifying a max pool value to create a policy within the InsuranceCompany contract
- Max pool value = Maximum amount of CS tokens allocated by the policy lister to their created policy

#### Marketplace.sol
- Allows a policy lister to list their policy
- Allow a policy buyer to purchase a policy, provided they have paid the required minimum premium, which is calculated as follows:
- `Minimum premium amount = Minimum stake of the created policy * Conversion rate`.
- Allow a policy buyer to file a claim on their purchased policy, as long as their coverage period has not ended at the time of the claim
- `End of Coverage Period = Policy purchase timestamp + Policy coverage period`

## Full Test-Scenario process for policy listing and buying in marketplace
1) Assume policy lister A to take on the following test account address in remix `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4`.
2) Lister A accesses the CSToken.sol contract and mints **15000** CS tokens at a conversion rate of **2**, and stakes **30000** wei as the collateral, using the `mint` function.
4) Lister A then views their minted token information via the `getMyTokenInformation()` method in CSToken.sol which will be as follows:
   - Minted Tokens: 15000
   - Collateral: 30000
   - Conversion Rate: 2
6) Once Lister A has minted tokens successfully, he proceeds to use the InsuranceCompany.sol contract to create a policy using the `createANewPolicy` method in the contract.
7) Lister A creates a new policy specifying the following arguments:
   - PolicyName: TravelSure
   - PolicyType: Travel
   <!--claim back rate is the payout rate for each CS token that the policy buyer owns of the policy -->
   - ClaimBackRate: 3 wei/token
   <!-- max pool value is the amount of tokens allocated by Lister A to the newly created policy -->
   - MaxPoolValue: 5000 
   <!-- minimum stake is the minimum amount of tokens a policy buyer must own to get a share of the policy, in this case, the amount policy buyer must pay is 100 tokens * conversion rate of 2 = 200 wei -->
   - Minimum stake: 100
   <!-- Coverage period specifies how long the policy buyer is working -->
   - Coverage period: 7 days (within blockchain it is stored as seconds, but will not affect claiming process)
8) New policy with an Id of 1 is created by lister A, for him to view
9) Lister A proceeds to list the policy with an Id of 1 using the `listPolicy` method in Marketplace.sol:
   - Before Lister A can list policy Id 1, he has to give ownership of the 5000 max pool value CS tokens to the marketplace so that the marketplace can manage the tokens on his behalf
   - Once the marketplace has control over the tokens, anytime a policy buyer buys into policy Id 1, they will receive the equivalent amount of CS tokens based on their parsed in msg.value amount.
10) Now, we move on to the policy buyer B who will take on the following test account address `0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2`.
11) Policy buyer B will view all the listed policies using `ViewListedPolicies` method in Marketplace.sol and verifies that policy Id 1 is indeed listed and check its details
12) Buyer B will then purchase a share of policy Id1 using `buyPolicy` method in Marketplace.sol, where he is required to pay at least the min premium amount of **200 wei**
    - Min.stake of policy Id = 100 CS tokens, Conversion rate specified by Lister A = 2 wei/token, Hence min.premium amount = 200 wei.
    - Should Buyer B decide to purchase more into the policy, he can provide a higher msg.value and he will be dynamically allocated the equivalent amount of CS tokens
    - Eg: **250 wei/conversion rate of 2 = 125 CS tokens**
13) Buyer B will then view his bought policies using `viewMyBoughtPolicies` method in Marketplace.sol, which includes details such as:
    - The policy he bought
    - The coverage period that buyer B is insured under this policy
    - His owned CS tokens (125 CS tokens)
14) Since Buyer B's coverage period has not ended, he is then eligible to make a claim on his bought policy using the `claimPolicy` method in Marketplace.sol
    - The total claim amount for buyer B will be calculated as follows: `Owned CS tokens * Policy claim back rate = 125 CS tokens * 3 = 375 wei`
    - This claim amount of **375** wei will be deducted from Lister A's staked collateral of **30000 wei** and transferred to buyer B
    - At the same time, buyer B's 125 owned CS tokens will be burnt to prevent double claiming
    - Finally, since the buyer has claimed against the policy, the claimed policy will be removed from his bought policies
