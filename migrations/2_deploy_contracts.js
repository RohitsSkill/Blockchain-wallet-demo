var wallet = artifacts.require("./wallet.sol");

module.exports = function(deployer) {
  deployer.deploy(wallet);
};
