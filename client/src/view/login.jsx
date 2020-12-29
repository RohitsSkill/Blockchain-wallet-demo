import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Register from "./register.jsx";
import Send from "./send.jsx";
import walletContract from "../contracts/wallet.json";
import getWeb3 from "../getWeb3";

class login extends Component{
	state = {
		email:"",
		password:"",
        add:null,
        to:null,
        Ammount:0,
        Balance:0,
        storageValue: 0,
        web3: null,
        accounts: null,
        contract: null
    }
    componentDidMount = async() => {
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
			this.setState({ add: accounts[0], web3, accounts, contract: instance, abi: null });
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(`Failed to load web3, accounts, or contract. Check console for details.`);
          console.error(error);
        }
    }

	updateUsername =(event)=> {
		this.setState({email : event.target.value});
	}

	updatePassword =(event)=> {
		this.setState({password : event.target.value});
	}

	validate = (event)=>{
		event.preventDefault();
		if(this.state.email.toLowerCase==="r@gmail.com".toLowerCase && this.state.password==="1"){
			ReactDOM.render(<Send/>,document.getElementById("root"));
		}
		else{
			alert("Wrong Password");
		}
	}

	gotoregister = () =>{
		ReactDOM.render(<Register/>,document.getElementById("root"));
	}

	render = () => {
		const image = '../style/images/bg-01.jpg';
		if(this.state.web3==null){
			return <h1>Loading data...</h1>;
		}
		return (<div>
		<div className="container-login100 backImage" style={{backgroundImage:image}}>
			<div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
				<form onSubmit={this.validate} className="login100-form validate-form" >
					<span className="login100-form-title p-b-37">
						Sign In
					</span>

					<div className="wrap-input100 validate-input m-b-20" data-validate="Enter username or email">
						<input className="input100" type="email" name="email" placeholder="username or email" onChange={this.updateUsername}/>
						<span className="focus-input100"></span>
					</div>

					<div className="wrap-input100 validate-input m-b-25" data-validate = "Enter password">
						<input className="input100" type="password" name="pass" placeholder="password" onChange={this.updatePassword}/>
						<span className="focus-input100"></span>
					</div>

					<div className="container-login100-form-btn">
						<button className="login100-form-btn">
							Sign In
						</button>
					</div>

					<div className="text-center p-t-57 p-b-20">
						<span className="txt1">
							Or login with
						</span>
					</div>

					<div className="flex-c p-b-112">
						<a onClick={this.validate} className="login100-social-item">
							<i className="fa fa-facebook-f"></i>
						</a>

						<a onClick={this.validate} className="login100-social-item">
							<img src="images/icons/icon-google.png" alt="GOOGLE"></img>
						</a>
					</div>

					<div className="text-center">
						<a onClick={this.gotoregister} className="txt2 hov1">
							Sign up
						</a>
					</div>
				</form>			
			</div>
		</div>
		</div>);
	}
}
export default login;