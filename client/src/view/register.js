import React, { Component } from "react";
import login from "login.html";


function register(){
    return login
    // return (<div class="App box">
    //     <form action="display()" method="POST">
    //     Email : <input type="email" name="username"></input><br/>   
    //     password : <input type="number" hint="username" name="password"></input><br/>
    //     <input type="submit"/>
    //     </form>
    //     <div id="data" class="disp">
    //     name : <text name="name"></text>
    //     pass : <text name="pass"></text>
    //     </div>
    // </div>);
}
function display(){
    const username = postMessage.arguments.user;
    const password = postMessage.arguments.pass;
    document.getElementsByName("name").values = username;
    document.getElementsByName("pass").values = password;
    document.getElementsByid("data").display = true;
}
export default register;
