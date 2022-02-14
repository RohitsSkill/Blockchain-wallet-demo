//this is solidity contract for our wallet application
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma experimental ABIEncoderV2;

contract wallet {
    address owner;

    struct Wallet {
        address id;
        uint256 ammount;
        string name;
        string mailid;
        string password;
        bool isvalid;
    }

    struct transaction {
        string to;
        string from;
        uint256 ammount;
        uint256 time;
    }

    mapping(address => Wallet) getwallet;
    mapping(address => transaction[]) getTrans;
    mapping(string => address) registered;

    constructor(
        string memory name,
        string memory mailid,
        string memory password
    ) public {
        owner = msg.sender;
        getwallet[msg.sender] = Wallet(owner, 10, name, mailid, password, true);
        registered[mailid] = msg.sender;
    }

    function convert(string memory key) public pure returns (bytes32 ret) {
        if (bytes(key).length > 32) {
            revert();
        }

        assembly {
            ret := mload(add(key, 32))
        }
    }

    function isValid(string memory mail) public view returns (address) {
        // if (registered[mail] == address(0)) return false;
        return registered[mail];
    }

    function createWallet(
        string memory name,
        string memory mailid,
        string memory password
    ) public returns (address) {
        //returns (bool) {
        // if (!getwallet[mailid].isvalid) return false;
        getwallet[msg.sender] = Wallet(
            msg.sender,
            10,
            name,
            mailid,
            password,
            true
        );
        registered[mailid] = msg.sender;
        // registered[mailid] = true;
        return registered[mailid];
    }

    function showAmmount() public view returns (uint256) {
        return getwallet[msg.sender].ammount;
    }

    function login(string memory mail, string memory password)
        public
        view
        returns (address)
    {
        address add = registered[mail];
        string memory pass = getwallet[add].password;
        if (keccak256(bytes(password)) == keccak256(bytes(pass))) return add;
        return address(0);
    }

    function setNewPass(string memory password) public {
        getwallet[msg.sender].password = password;
    }

    function getPass(string memory email) public view returns (string memory) {
        if (registered[email] != address(0))
            return getwallet[registered[email]].password;
        else return "0";
    }

    function sendAmmount(string memory to, uint64 bal)
        public
        returns (address)
    {
        address receiver = registered[to];
        if (receiver == address(0)) {
            return receiver;
        }
        getTrans[msg.sender].push(
            transaction(to, getwallet[msg.sender].mailid, bal, now)
        );
        getTrans[receiver].push(
            transaction(to, getwallet[msg.sender].mailid, bal, now)
        );
        if (msg.sender == owner) {
            getwallet[receiver].ammount += bal;
            return receiver;
        } else {
            getwallet[msg.sender].ammount -= bal;
            getwallet[receiver].ammount += bal;
            return receiver;
        }
    }

    function isOwner() public view returns (bool) {
        if (msg.sender == owner) return true;
        else return false;
    }

    function retTrans() public view returns (transaction[] memory) {
        return getTrans[msg.sender];
    }
}
