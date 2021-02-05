import React from "react";
import ReactDOM from 'react-dom';
import Login from "./login.jsx";
import emailjs from "emailjs-com";
import walletContract from "../contracts/wallet.json";
import getWeb3 from "../getWeb3";
import {Miner} from 'web3-eth-miner';

var Accounts = require('web3-eth-accounts');

class register extends React.Component{
	state = {
		name:null,
		email:null,
		otp:null,
		password:null,
		cnfPass:null,
		isDisabled: true,
        // add:null,
        web3: null,
        // accounts: null,
		contract: null,
		newAccount:"'0x26c39F83118FFed3C65C35c2971A8fF46C4C5317',",
		privateKey:"b2da868b834aa8487e07e95751d1cee5064defe070a98349ea93015b5946a5f8",
	}


	componentDidMount = async() => {
        try {
		  	// Get network provider and web3 instance.
			const web3 = await getWeb3();
			console.log(web3);
			// this.setState({contract});
			// Use web3 to get the user's accounts.
			const accounts = await web3.eth.getAccounts();
		
			// // Get the contract instance.
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = walletContract.networks[networkId];
			const instance = new web3.eth.Contract(
				walletContract.abi,
				deployedNetwork && deployedNetwork.address,
			);
			this.setState({web3,contract: instance});
			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ add: accounts[0], web3, accounts, contract: instance, abi: null});
			// if(this.state.isDisabled==true){
			// 	document.getElementById("EmailVerification").style["display"] = "none";
			// 	document.getElementById("setPassword").style["display"] = "none";
			// }
			// alert(accounts);
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(`Failed to load web3, accounts, or contract. Check console for details.`);
          console.error(error);
        }
    }

	updateUsername =(event)=> {
		this.setState({email: event.target.value});
	}

	updatename =(event)=> {
		this.setState({name: event.target.value});
	}

	updatePassword =(event)=> {
		this.setState({password: event.target.value});
	}

	updateCnfPassword =(event)=> {
		this.setState({cnfPass: event.target.value});
	}

	setPassword = async(event) => {
		event.preventDefault();
		event.persist();
		if (this.state.password==this.state.cnfPass){
			try{
				const {web3, contract} = this.state;
				console.log("Creating new Account....")
				const ac = await web3.eth.personal.newAccount(this.state.password);
				const isunlocked = await web3.eth.personal.unlockAccount(ac,this.state.password);
				console.log("isUnlocked : "+isunlocked);

				const options = {
					defaultAccount: ac,
					defaultBlock: 'latest',
					defaultGas: 1,
					defaultGasPrice: 0,
					transactionBlockTimeout: 50,
					transactionConfirmationBlocks: 24,
					transactionPollingTimeout: 480
				}

				const miner = new Miner("http://127.0.0.1:8543", null,options);
				
				console.log(miner);
				const setminer = await miner.setEtherbase(ac);
				console.log("Is miner set : "+setminer);
				// miner.startMining(2);
				// console.log("setMinner : "+setminer);
				// const ismining = null;
				// await miner.startMining(4,function(err,res){
				// 	if(err){
				// 		console.log(err);
				// 	}
				// 	ismining = res;
				// 	console.log(ismining);
				// })
				// console.log("isMining : "+ismining);
				console.log(ac);
				// console.log("Created, now Creating wallet....")
				let bal = await web3.eth.getBalance(ac);
				console.log(bal);
				while(bal<5){
					bal = await web3.eth.getBalance(ac);
					bal = web3.utils.fromWei(bal,"ether");
					console.log(bal);
				}
				const res = await contract.methods.createWallet(this.state.name, this.state.email, this.state.password).send({from:ac});
				console.log(res);
				// const stopmine = await miner.stopMining();
				console.log(this.state);
				let msg = {
					to_name: this.state.name,
					address: ac,
					// privateKey: this.state.privateKey,
					password: this.state.password,
					to: this.state.email,
				}
				emailjs.send("service_hdgwsxh","registration",msg,"user_Pg2oWEKr29oq0kyPvu2af");
				alert("Registration Successful");
				return;
			}catch(e){
				console.log("error: "+e);
				alert(e);
				return;
			}
		}else{
			alert("Password not match..!")
			return;
		}
	}

	validate = (event)=>{
		event.preventDefault();
		if (event.target.otp.value == this.state.otp){
			alert("verified");
			document.getElementById("EmailVerification").style["display"] = "none";
			document.getElementById("setPassword").style["display"] = "block";
		}
		else{
			alert("Please Enter Correct OTP");
		}
	}

	checkValid = async() => {
		try{
			const {contract,web3} = this.state;
			// const acc = await web3.eth.accounts.create();
			// console.log(acc);
			// const ac = await web3.eth.personal.newAccount(acc.privateKey);
			// console.log(ac);
				try{
					const res = await contract.methods.isValid(this.state.email).call();
					// alert(this.state.accounts[0])
					console.log(res);
					if (res!="0x0000000000000000000000000000000000000000"){
						// const acc = await web3.eth.accounts.deleteAccount(acc.address, acc.privateKey);
						alert("Email Already used..!")
						return true;
					}
					else{
						// this.setState({newAccount:acc,privateKey:getKey(acc,"1234")});
						console.log(this.state);
						return false;
					}
				}catch(e){
					// this.setState({newAccount:acc,privateKey:getKey(acc,"1234")});
					console.log(this.state);
					return false;
				}
			//const id = await contract.method
		}catch(e){
			console.log(e)
			alert(e);
			return true;
		}
	}
	getOtp = async(event) => {
		event.preventDefault();
		event.persist();
		if(this.state.email==null || this.state.email==""){
			alert("Enter Email");
			return;
		}
		const res = await this.checkValid();

		if(res){
			// console.log("Email Already used..!")
			return;
		}

		const digits = '0123456789';
		let OTP = '';
		for (let i = 0; i < 4; i++) {
			OTP += digits[Math.floor(Math.random() * 10)];
		}
		const doc = document.getElementById("provideOtp");
		doc.otp.value = OTP;
		
		console.log(doc.otp.value);
		this.setState({otp: OTP});
		this.setState({isDisabled: false});
		emailjs.sendForm('service_hdgwsxh', 'otpEmail_7oyyweh', event.target, 'user_Pg2oWEKr29oq0kyPvu2af')
			.then((result) => {
				console.log(result.text);
				alert("OTP send to your Mail");
				this.setState({isDisabled: false});
			}, (error) => {
				console.log(error.text);
				alert(error);
		});
		
	}
	
	gotologin = ()=>{
		ReactDOM.render(<Login/>,document.getElementById("root"));
	}

	// getKey = (add,pass) => {
	// 	const address= add;
	// 	const password = pass;
	
	// 	try{
	// 		const keyObject = keythereum.importFromFile(address, datadir);
	// 		const privateKey = keythereum.recover(password, keyObject);
	// 		console.log(privateKey.toString('hex'));
	// 		return (privateKey.toString('hex'));
	// 	}catch(e){
	// 		console.log(e);
	// 		return e;
	// 	}
	// }

	render(){
		if (this.state.web3==null)
			return (<div className="container-login100">
						<div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
							{/* <Spinner animation="border" role="status"></Spinner> */}
						  	<h4>Connecting to Server....</h4>
						</div>
				</div>);

		return (<div>
		<div className="container-login100 backImage">
			<div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
				<div id="EmailVerification">
					<span className="login100-form-title p-b-37">
						Sign Up
					</span>
					<form onSubmit={this.getOtp} id = "provideOtp">
						<div className="wrap-input100 validate-input m-b-20" data-validate="Enter username or email">
							<input className="input100" type="email" name="to" placeholder="email" onChange={this.updateUsername}/>
							<span className="focus-input100"></span>
						</div>

						<div className="wrap-input100 validate-input m-b-20" data-validate="Enter username or email" style={{display:"none"}}>
							<input className="input100" type="otp" name="otp" placeholder="otp" />
							<span className="focus-input100"></span>
						</div>

						<div className="container-login100-form-btn">
							<button className="login100-form-btn">
								Get OTP
							</button>
						</div>
					</form>

					<br></br>

					<form onSubmit={this.validate} className="login100-form validate-form" >
						<div className="wrap-input100 validate-input m-b-20" data-validate="Enter username or email">
							<input className="input100" type="number" name="otp" placeholder="OTP"/>
							<span className="focus-input100"></span>
						</div>

						<div className="container-login100-form-btn">
							<button className="login100-form-btn validation-otp" disabled = {this.state.isDisabled}>
								Validate
							</button>
						</div>
					</form>				
				</div>

				<form onSubmit={this.setPassword} className="login100-form validate-form" id="setPassword" style={{display: "none"}}>
					<span className="login100-form-title p-b-37">
						Sign Up
					</span>

					<div className="wrap-input100 validate-input m-b-25" data-validate = "Enter Name">
						<input className="input100" type="name" name="name" placeholder="Name" onChange={this.updatename}/>
						<span className="focus-input100"></span>
					</div>

					<div className="wrap-input100 validate-input m-b-25" data-validate = "Enter password">
						<input className="input100" type="password" name="pass" placeholder="password" onChange={this.updatePassword}/>
						<span className="focus-input100"></span>
					</div>

					<div className="wrap-input100 validate-input m-b-25" data-validate="Enter username or email">
						<input className="input100" type="password" name="cnf_password" placeholder="conform password" onChange={this.updateCnfPassword}/>
						<span className="focus-input100"></span>
					</div>

					<div className="container-login100-form-btn">
						<button className="login100-form-btn">
							Register
						</button>
					</div>

				</form>	
				<br></br>
				<div className="text-center">
					<a onClick={this.gotologin} className="txt2 hov1">
							Sign In
					</a>
				</div>		
			</div>
		</div>
		</div>);
	}
}
export default register;
