// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import ".deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CIToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    uint256 private remainingCollateral;

    mapping(address => uint256) public collateral;  // Tracks ether collateral per user
    mapping(address => uint256) public userConversionRate;  // Tracks conversion rate per user

    // Define a Mint event
    event Mint(address indexed to, uint256 amount, uint256 collateral);
    event UserTokenInfo(address indexed account, uint256 amtTokens, uint256 collateral);

    constructor() payable 
        ERC20("Co-InsuranceToken", "CIT")
        Ownable(msg.sender)
        ERC20Permit("Co-InsuranceToken")
    {}

    modifier mustBeTokenOwner() {
        require(collateral[msg.sender] > 0,"You must have minted tokens to query this information");
        _;
    }

    // I dont think this should be onlyOwner, cuz that would mean only the contract deployer can mint
    function mint(uint256 amount, uint256 conversionRate) public payable onlyOwner {
        uint256 requiredCollateral = amount * conversionRate * 0.5 ether;  
        // 0.5 ether here was for me to test w/o going over 100 ether limit, might want to just use default wei value?

        // Do we let them pay over the required then transfer any excess back, instead of hard fixing it has to be the exact same?
        require(msg.value == requiredCollateral, "You should be inputting a value that is the amt of tokens * conversionRate");

        _mint(msg.sender, amount);  // Mint tokens to whoever created the CI token
        collateral[msg.sender] += msg.value;  // Record the ether collateral
        userConversionRate[msg.sender] = conversionRate;  // Store the user's conversion rate

        emit Mint(msg.sender, amount, requiredCollateral); // Announce that you have minted how many tokens and collateral involved
    }

    function topUpMyCollateral(uint256 amount) public payable mustBeTokenOwner {
        // still deciding the logic
    }

    function getMyTokenInformation() public mustBeTokenOwner {
        remainingCollateral = collateral[msg.sender];
        uint256 collateralInEth = remainingCollateral / 1 ether; // Convert from wei to ether
        uint256 currentTokensRemaining = balanceOf(msg.sender);
        emit UserTokenInfo(msg.sender, currentTokensRemaining, collateralInEth);
    }

    // should this be public? i feel like it should be handled by the marketplace contract only to burn
    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }
}
