# IS4302 - ChainSure: Decentralized Insurance Marketplace

# Remix Test Run

## Deployment phase
Deploy CSToken.sol with 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
Deploy InsuranceCompany.sol with 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2 using address of CSToken
Deploy Marketplace.sol with 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db using address of CSToken and address of InsuranceCompany


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
