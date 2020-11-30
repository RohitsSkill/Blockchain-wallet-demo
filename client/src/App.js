import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import walletContract from "./contracts/wallet.json";
import getWeb3 from "./getWeb3";
import register from "./view/register";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };
  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetwork = walletContract.networks[networkId];
      const instance = new web3.eth.Contract(
        walletContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, abi: null }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(0).send({ from: accounts[0] });
    //await contract.methods.createWallet(accounts[0],100,"hello").send({from : accounts[0]});
    //map.set(accounts[0],100);
    // Get the value from the contract to prove it worked.
  
    //const response = await contract.methods.showAmmount(accounts[0]).call();
    //const response = map.get(accounts[0]);
    // Update state with the result.
    //const data = web3.eth.
    //this.setState({ storageValue: response });
    //console.log("abi : " + data);
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
      const data = register();
      return data;
    // return (
    //   <div className="App">
    //     <h1>Good to Go!</h1>
    //     <p>Your Truffle Box is installed and ready.</p>
    //     <h2>Smart Contract Example</h2>
    //     <p>
    //       If your contracts compiled and migrated successfully, below will show
    //       a stored value of 5 (by default).
    //     </p>
    //     <p>
    //       Try changing the value stored on <strong>line 40</strong> of App.js.
    //     </p>
    //     <div>The stored value is: {this.state.storageValue}</div>
    //     <div>The Account address is: {this.state.accounts[0]}</div>
    //   </div>
    // );
  }
}

export default App;
