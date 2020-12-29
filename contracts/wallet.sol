//this is solidity contract for our wallet application
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract wallet {
    address owner;

    struct Wallet {
        address id;
        uint256 ammount;
        string mailid;
    }

    mapping(address => Wallet) getwallet;

    // modifier isOwner() {
    //     require(msg.sender == this.owner);
    //     _;
    // }

    constructor() public {
        owner = msg.sender;
    }

    function createWallet(address add, string memory mailid) public {
        getwallet[add] = Wallet(add, 0, mailid);
    }

    function showAmmount() public view returns (uint256) {
        return getwallet[msg.sender].ammount;
    }

    function sendAmmount(address to, uint64 bal) public returns (uint256) {
        if (msg.sender == owner) {
            getwallet[to].ammount += bal;
            return getwallet[msg.sender].ammount;
        } else {
            getwallet[msg.sender].ammount -= bal;
            getwallet[to].ammount += bal;
            return getwallet[msg.sender].ammount;
        }
    }

    function isOwner() public view returns (bool) {
        if (msg.sender == owner) return true;
        else return false;
    }
}
