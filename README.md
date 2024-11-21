# IS4302 - ChainSure: Decentralized Insurance Marketplace


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

## CSToken.sol
- Used by policy listers to mint ChainSure (CS) tokens by converting an equivalent amount of wei to CS tokens based on a user-defined conversion rate
- This enables policy listers to stake a certain amount of collateral to their minted cs tokens using the formula: `Minted CS tokens * Conversion Rate = Staked Collateral`.

## InsuranceCompany.sol
- Once a policy lister has minted CS tokens, they can then stake their CS tokens by specifying a max pool value to create a policy within the InsuranceCompany contract
- Max pool value = Maximum amount of CS tokens allocated by the policy lister to their created policy

## Marketplace.sol
- Allows a policy lister to list their policy
- Allow a policy buyer to purchase a policy, provided they have paid the required minimum premium, which is calculated as follows:
- `Minimum premium amount = Minimum stake of the created policy * Conversion rate`.
- Allow a policy buyer to file a claim on their purchased policy, as long as their coverage period has not ended at the time of the claim
- `End of Coverage Period = Policy purchase timestamp + Policy coverage period
