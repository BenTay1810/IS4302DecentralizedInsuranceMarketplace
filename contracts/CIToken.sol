// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import ".deps/npm/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import ".deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import ".deps/npm/@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CIToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    uint256 public conversionRate = 5;

    constructor() payable
        ERC20("Co-InsuranceToken", "CIT")
        Ownable(msg.sender)
        ERC20Permit("Co-InsuranceToken")
    {}
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public override {
        _burn(msg.sender, amount);
    }
}
