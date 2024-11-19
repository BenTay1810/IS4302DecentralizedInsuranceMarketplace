# IS4302DecentralizedInsuranceMarketplace
Decentralized Insurance Marketplace [ChainSure]

2 stakeholders: Policy Listers & Policy Buyers

3 contracts:
1) CSToken.sol
2) InsuranceCompany.sol
3) Marketplace.sol

# CSToken.sol
- Used by policy listers to mint CS tokens by converting an equivalent amount of wei to CS tokens based on a user-defined conversion rate

# InsuranceCompany.sol
- Once a policy lister has minted CS tokens, they can then stake their CS tokens to create a policy within this contract, and list that policy within the marketplace

# Marketplace.sol
- Allows a policy lister to list their policy
- Allows a policy buyer to buy a policy if they have paid the min.stake
- Allows a policy buyer to make claims on their bought policy
