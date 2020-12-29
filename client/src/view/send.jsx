import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Login from "./login.jsx";
import walletContract from "../contracts/wallet.json";
import getWeb3 from "../getWeb3";

class Send extends Component{
    state = { 
        add:null,
        to:null,
        Ammount:0,
        Balance:0,
        storageValue: 0,
        web3: null,
        accounts: null,
        contract: null
    };
    constructor(props,context){
        super(props,context);
    }
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
          this.setState({ add: accounts[0], web3, accounts, contract: instance, abi: null }, this.updateBalance);
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details. in send.jsx`,
          );
          console.error(error);
        }
    };

    updateAddress =(event) => {
        this.setState({to:event.target.value});
    }

    updateAmmount =(event) => {
        this.setState({Ammount : event.target.value});
    }
    updateBalance = async() => {
        try{
            const { accounts, contract } = this.state;
            const ammount = await contract.methods.showAmmount().call({from:accounts[0]});
            this.setState({Balance:ammount});
        }
        catch(error){
            alert ("Connect Your meta mask to proper network");
            console.log(error); 
        }
    }
    validate = async (event)=>{
        try{
            event.preventDefault();
            const { accounts, contract } = this.state;
            if(this.state.to!=null){
                const owner = await contract.methods.isOwner().call({from:this.state.add});
                alert(owner);
                if(owner===true || this.state.Balance>0){
                    await contract.methods.sendAmmount(this.state.to,this.state.Ammount).send({from:this.state.add});
                    const ammount = await contract.methods.showAmmount().call({from:this.state.add});
                    this.setState({Balance:ammount});
                }
                else{
                    alert("Insufficient Balance");
                }
            }
        }
        catch(error){
            alert("Connect Your meta mask to proper Address");
            console.log(error); 
        }
    }

    gotologin = () => {
        ReactDOM.render(<Login/>,document.getElementById("root"));
    }

    render(){ 
        if(this.state.web3==null){
            return <h1>Server Not Started...</h1>;
        }
        return (
            <div className="container-login100 backImage">
                <div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
                    <form onSubmit={this.validate} className="login100-form validate-form">
                        <span className="login100-form-title p-b-37">
                            Send Money<br/>
                            <h5 className="owner" style={{visibility:"hidden"}}>You are Owner</h5>
                            <h5>Account : {this.state.add}</h5>
                            <h5>Balance = {this.state.Balance}</h5>
                        </span>

                        <div className="wrap-input100 validate-input m-b-20" data-validate="To">
                            <input onChange={this.updateAddress} className="input100" type="text" name="to" placeholder="Receiver"/>
                            <span className="focus-input100"></span>
                        </div>

                        <div className="wrap-input100 validate-input m-b-25" data-validate = "Enter Ammount">
                            <input onChange={this.updateAmmount} className="input100" type="number" name="Ammount" placeholder="Ammount"/>
                            <span className="focus-input100"></span>
                        </div>

                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn">
                                Send
                            </button>
                        </div>
                        <br></br>
                        <div className="text-center">
                            <a onClick={this.gotologin} className="txt2 hov1">
                                Sign out
                            </a>
                        </div>
                    </form>        
                </div>
            </div>
        );
    }
}
export default Send;
