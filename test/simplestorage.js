const wallet = artifacts.require("./wallet.sol");

contract("wallet", accounts => {
  it("...should store the value 89.", async () => {
    let walletInstance;
    await wallet.deployed().then(function(instance){walletInstance = instance;});

    // Set value of 89
    await walletInstance.createWallet(accounts[0],1000,"tatasky");

    // Get stored value
    let storedData;
    await walletInstance.showAmmount.call(accounts[1]).then(function(data){storedData = data;});

    assert.equal(storedData, 0, "The value 89 was not stored.");
  });
});
