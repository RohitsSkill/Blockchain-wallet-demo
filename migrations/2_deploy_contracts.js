var wallet = artifacts.require("./wallet.sol");

module.exports = function(deployer) {
  const name = "Rohit Pawar"
  const mailid = "tatasky@gmail.com"
  const  password = "1234"
  deployer.deploy(wallet,name, mailid, password);
};
