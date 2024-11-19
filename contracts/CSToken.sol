// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import ".deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // for error specification


contract CSToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    uint256 private remainingCollateral;
    

    mapping(address => uint256) public collateral;  // Tracks ether collateral per user
    mapping(address => uint256) public userConversionRate;  // Tracks conversion rate per user

    // Define a Mint event
    event Mint(address indexed to, uint256 amount, uint256 collateral);
    event UserTokenInfo(address indexed account, uint256 amtTokens, uint256 collateral, uint256 conversionRate);
    event ReturnExcess(address indexed account, uint256 excessAmt);

    constructor() payable 
        ERC20("ChainSureToken", "CST")
        Ownable(msg.sender)  // get rid?
        ERC20Permit("ChainSureToken") // abstracts away complexity of manual approving of token transfer between contratcs
    {}

    modifier mustBeTokenOwner() {
        require(collateral[msg.sender] > 0,"You must have minted tokens to query this information");
        _;
    }

    modifier mustNotBeTokenOwner() {
        require(collateral[msg.sender] == 0, "You must not have minted tokens to query this information");
        _; 
    }

    // amount = amount of CS tokens to mint & conversionRate = how much insurance lister willing to stake in wei for the that amount of CS tokens
    function mint(uint256 amount, uint256 conversionRate) public payable mustNotBeTokenOwner{
        uint256 requiredCollateral = amount * conversionRate; // stick with default wei value

        require(msg.value >= requiredCollateral, 
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

        uint256 excessAmount = msg.value - requiredCollateral;
        // Transfer the excess amount back to the sender
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);  // Send the excess amount back to msg.sender
            emit ReturnExcess(msg.sender, excessAmount);
        }

        _mint(msg.sender, amount);  // Mint tokens to whoever created the CI token
        collateral[msg.sender] += requiredCollateral;  
        userConversionRate[msg.sender] = conversionRate;  // Store the user's conversion rate

        emit Mint(msg.sender, amount, requiredCollateral); // Announce that you have minted how many tokens and collateral involved
    }

    // For an insurance lister to top up existing CS tokens, they must stick with same conversion rate previously defined
    function topUpMyTokens(uint256 amount) public payable mustBeTokenOwner {
        uint256 storedConversionRate = userConversionRate[msg.sender];
        uint256 requiredCollateral = amount * storedConversionRate;
        require(msg.value >= requiredCollateral, 
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

        uint256 excessAmount = msg.value - requiredCollateral;
        // Transfer the excess amount back to the sender
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);  // Send the excess amount back to msg.sender
            emit ReturnExcess(msg.sender, excessAmount);
        }

        _mint(msg.sender,amount); // Adds more tokens to user's existing token supply since they topped up
        collateral[msg.sender] += requiredCollateral;  // Record the top up in collateral too
    }

    function getMyTokenInformation() public mustBeTokenOwner {
        remainingCollateral = collateral[msg.sender];
        uint256 storedConversionRate = userConversionRate[msg.sender];
        uint256 currentTokensRemaining = balanceOf(msg.sender);
        emit UserTokenInfo(msg.sender, currentTokensRemaining, remainingCollateral, storedConversionRate);
    }

    function getUserCollateral(address lister) external view returns (uint256) {
        return collateral[lister];
    }

    function getUserConversionRate(address lister) external view returns (uint256) {
        return userConversionRate[lister];
    }

    // should this be public? i feel like it should be handled by the marketplace contract only to burn
    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }
}
