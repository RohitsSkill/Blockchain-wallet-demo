// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/wallet.sol";

contract testwallet {
    function testItStoresAValue() public {
        wallet wlt = wallet(DeployedAddresses.wallet());

        wlt.createWallet(msg.sender, 100, "Rohitp");

        uint256 expected = 100;

        Assert.equal(
            wlt.showAmmount(msg.sender),
            expected,
            "It should store the ammount 100."
        );
    }
}
