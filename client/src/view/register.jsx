import React from "react";
import ReactDOM from 'react-dom';
import Login from "./login.jsx";
import Send from "./send.jsx";
let cred = {
	email:"",
	password:"",
	cnfPass:""
}
const updateUsername =(event)=> {
	cred.email = event.target.value;
}
const updatePassword =(event)=> {
	cred.password = event.target.value;
}
const updateCnfPassword =(event)=> {
	cred.cnfPass = event.target.value;
}
const validate = (event)=>{
	event.preventDefault();
	alert(cred.email);
}
const gotologin = ()=>{
	ReactDOM.render(<Login/>,document.getElementById("root"));
}
function register(){
	return (<div>
	<div className="container-login100 backImage">
		<div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
			<form onSubmit={validate} className="login100-form validate-form" >
				<span className="login100-form-title p-b-37">
					Sign Up
				</span>

				<div className="wrap-input100 validate-input m-b-20" data-validate="Enter username or email">
					<input className="input100" type="email" name="email" placeholder="username or email" onChange={updateUsername}/>
					<span className="focus-input100"></span>
				</div>

				<div className="wrap-input100 validate-input m-b-25" data-validate = "Enter password">
					<input className="input100" type="password" name="pass" placeholder="password" onChange={updatePassword}/>
					<span className="focus-input100"></span>
				</div>

				<div className="wrap-input100 validate-input m-b-25" data-validate="Enter username or email">
					<input className="input100" type="password" name="cnf_password" placeholder="conform password" onChange={updateCnfPassword}/>
					<span className="focus-input100"></span>
				</div>

				<div className="container-login100-form-btn">
					<button className="login100-form-btn">
						Sign In
					</button>
				</div><br></br>

				<div className="text-center">
					<a onClick={gotologin} className="txt2 hov1">
						Sign In
					</a>
				</div>
			</form>			
		</div>
	</div>
	</div>);
}
export default register;
