const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
        host: "127.0.0.1",
        port: 8543,
        network_id: "*", // Match any network id
        from: "0x989526a5b1f3d6441ae7f5da8cdf12fe0025496b",//1234   //"0x0d9fdd69b4eb6d9ff0be2c6a8ab8470880eb95eb",   // 12345678
        gas: 8000000
    },
    // develop: {
    //   port: 8545,
    // },
  },
};
