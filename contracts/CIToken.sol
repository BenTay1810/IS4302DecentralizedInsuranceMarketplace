// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import ".deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // for error specification


contract CIToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    uint256 private remainingCollateral;

    mapping(address => uint256) public collateral;  // Tracks ether collateral per user
    mapping(address => uint256) public userConversionRate;  // Tracks conversion rate per user

    // Define a Mint event
    event Mint(address indexed to, uint256 amount, uint256 collateral);
    event UserTokenInfo(address indexed account, uint256 amtTokens, uint256 collateral, uint256 conversionRate);

    constructor() payable 
        ERC20("Co-InsuranceToken", "CIT")
        Ownable(msg.sender)
        ERC20Permit("Co-InsuranceToken")
    {}

    modifier mustBeTokenOwner() {
        require(collateral[msg.sender] > 0,"You must have minted tokens to query this information");
        _;
    }

    // Got rid of onlyOwner so everyone/company can mint a token
    function mint(uint256 amount, uint256 conversionRate) public payable {
        uint256 requiredCollateral = amount * conversionRate; // stick with default wei value

        // Do we let them pay over the required then transfer any excess back, instead of hard fixing it has to be the exact same?
        require(msg.value == requiredCollateral, 
            string(
                abi.encodePacked(
                    "Insufficient collateral: Required ", 
                    Strings.toString(requiredCollateral), 
                    " wei, but provided ", 
                    Strings.toString(msg.value), 
                    " wei."
                )
            )
        );

        _mint(msg.sender, amount);  // Mint tokens to whoever created the CI token
        collateral[msg.sender] += msg.value;  // Record the ether collateral
        userConversionRate[msg.sender] = conversionRate;  // Store the user's conversion rate

        emit Mint(msg.sender, amount, requiredCollateral); // Announce that you have minted how many tokens and collateral involved
    }

     function topUpMyTokens(uint256 amount) public payable mustBeTokenOwner {
        uint256 storedConversionRate = userConversionRate[msg.sender];
        uint256 requiredCollateral = amount * storedConversionRate;
        require(msg.value == requiredCollateral, 
            string(
                abi.encodePacked(
                    "Insufficient collateral: Required ", 
                    Strings.toString(requiredCollateral), 
                    " wei, but provided ", 
                    Strings.toString(msg.value), 
                    " wei."
                )
            )
        );
        _mint(msg.sender,amount); // Adds more tokens to user's existing token supply since they topped up
        collateral[msg.sender] += msg.value;  // Record the top up in collateral too
    }

    function getMyTokenInformation() public mustBeTokenOwner {
        remainingCollateral = collateral[msg.sender];
        uint256 storedConversionRate = userConversionRate[msg.sender];
        uint256 currentTokensRemaining = balanceOf(msg.sender);
        emit UserTokenInfo(msg.sender, currentTokensRemaining, remainingCollateral, storedConversionRate);
    }

    // should this be public? i feel like it should be handled by the marketplace contract only to burn
    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }
}
