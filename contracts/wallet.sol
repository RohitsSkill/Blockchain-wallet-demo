//this is solidity contract for our wallet application
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract wallet {
    struct Wallet {
        address id;
        uint256 ammount;
        string mailid;
    }

    mapping(address => Wallet) getwallet;

    //mapping(address => Wallet) getBallance;

    function createWallet(
        address add,
        uint256 ammount,
        string memory mailid
    ) public {
        getwallet[add] = Wallet(add, ammount, mailid);
    }

    function showAmmount(address add) public view returns (uint256) {
        return getwallet[add].ammount;
    }

    function sendAmmount(address add, uint64 ammount) public {
        getwallet[msg.sender].ammount -= ammount;
        getwallet[add].ammount += ammount;
    }
}
