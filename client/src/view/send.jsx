import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Login from "./login.jsx";
import walletContract from "../contracts/wallet.json";
import getWeb3 from "../getWeb3";
import GetTreans from "./getTreans.jsx";

class Send extends Component{
    state = { 
        email: null,
        add: null,
        to: null,
        Ammount: 0,
        Balance: 0,
        storageValue: 0,
        web3: null,
        accounts: null,
        contract: null,
        isOwner: false,
        transactions: null
    };

    static async getInitialProps(props) {
        const {address} = props.query;
    
        return { address };
      }

    componentDidMount = async () => {
        try {
            let data = localStorage.getItem("data");
            data = JSON.parse(data);
            // alert(`welcome ${data.email}`)
            console.log(data);
            if(data == null){
                ReactDOM.render(<Login/>,document.getElementById("root"));
            }

            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            console.log(web3)
        
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            //const deployedNetwork = SimpleStorageContract.networks[networkId];
            const deployedNetwork = walletContract.networks[networkId];
            // alert(deployedNetwork.address);
            const instance = new web3.eth.Contract(
                walletContract.abi,
                deployedNetwork && deployedNetwork.address,
            );
            // console.log("HERE IS INSTANCE : ");
            // console.log(instance);
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            const owner = await instance.methods.isOwner().call({from:data.accountNo});
            // const ammount = await instance.methods.showAmmount().call({from:this.state.add});
            // console.log(ammount);
            // this.setState({Balance:ammount});       
            


            let myaccount = this.state.add;
            let startBlockNumber = 2000; 
            let endBlockNumber = 2500;
            let t = 0;
            // const { web3 } = this.state;
            // const eth = await web3.eth;
            console.log('web3 : '+web3)
            console.log(web3.eth)
            if (endBlockNumber == null) {
                endBlockNumber = await web3.eth.getBlockNumber();
                console.log();
                console.log("Using endBlockNumber: " + endBlockNumber);
            }
            if (startBlockNumber == null) {
                startBlockNumber = endBlockNumber - 2000;
                console.log("Using startBlockNumber: " + startBlockNumber);
            }
            // console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
            // let trans = [];
            // for (let i = endBlockNumber; i>=startBlockNumber; i--) {
            //     if (i % 500 == 0) {
            //         console.log("Searching block " + i);
            //     }
            //     const block = await web3.eth.getBlock(i, true);
            //     // console.log(block);
            //     if (block != null && block.transactions != null) {
            //         block.transactions.forEach( function(e) {
            //             if (myaccount == e.from || myaccount == e.to) {
            //                 const temp = {hash : e.hash,
            //                     nonce           : e.nonce,
            //                     blockHash       : e.blockHash, 
            //                     blockNumber     : e.blockNumber, 
            //                     transactionIndex: e.transactionIndex, 
            //                     from            : e.from,
            //                     to              : e.to,
            //                     value           : e.value, 
            //                     time            : block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString(),
            //                     gasPrice        : e.gasPrice,
            //                     gas             : e.gas,
            //                 };
            //                 if(t<10){    
            //                     trans[t++] = temp;
            //                     console.log(trans[t]);
            //                 }
            //             }
            //         });
            //     }
            // }
            // // console.log(trans);
            // this.setState({transactions:trans});
            // // console.log(this.state.transactions);

            this.setState({ email: data.email,add: data.accountNo, web3, accounts, contract: instance, abi: null, isOwner:owner}, null);
            const bal = await this.state.contract.methods.showAmmount().call({from:this.state.add});
            console.log(bal);
            this.setState({Balance:bal});       


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
            const { contract } = this.state;
            const value = await contract.methods.showAmmount().call({from:this.state.add});
            this.setState({Balance:value});
        }
        catch(error){
            alert (error);
            console.log(error); 
        }
    }
    validate = async (event)=>{
        try{
            event.preventDefault();
            const { contract, web3 } = this.state;
            if(this.state.to!=null){
                console.log(this.state);
                if(parseInt(this.state.Balance)<parseInt(this.state.Ammount) || parseInt(this.state.Ammount)<1){
                    if(this.state.isOwner!=true){
                        if(this.state.Balance<this.state.Ammount)
                            console.log("Your balance ("+this.state.Balance+") is less than Ammount("+this.state.Ammount+")");
                        if(this.state.Ammount<1)
                            console.log("Your Ammount ("+this.state.Ammount+") is not valid");
                        alert("Invalid Ammount..!")
                        return;
                    }
                }
                if(this.state.isOwner===true || parseInt(this.state.Balance)>=parseInt(this.state.Ammount)){
                    const rec = await contract.methods.isValid(this.state.to).call({from:this.state.add});
                    console.log(rec);
                    if(rec != "0x0000000000000000000000000000000000000000"){
                        const pass = prompt("Enter password to sign your transaction.")
                        const isUnlocked = await web3.eth.personal.unlockAccount(this.state.add,pass);
                        if(isUnlocked===true){
                            const isDone = await contract.methods.sendAmmount(this.state.to,this.state.Ammount).send({from:this.state.add});
                            // alert(isDone);
                            const bal = await contract.methods.showAmmount().call({from:this.state.add});
                            const recBal = await contract.methods.showAmmount().call({from:isDone.to});
                            console.log(isDone);    
                            console.log(recBal);    
                            this.setState({Balance: bal});
                            console.log("Transaction Successul..! left balance is "+bal);
                            // let msg = {
                            //     to_name: "Customer",
                            //     address: this.state.add,
                            //     // privateKey: this.state.privateKey,
                            //     to: this.state.email,
                            //     ammount: this.state.ammount,
                            // }
                            // emailjs.send("service_hdgwsxh","sendAmmount",msg,"user_Pg2oWEKr29oq0kyPvu2af");
                        }else{
                            alert("Wrong Password");
                        }
                    }
                    else{
                        alert("Invalid Receiver.!");
                    }
                }
                else{
                    alert("Insufficient Balance");
                }
            }
        }
        catch(error){
            alert(error);
            console.log(error); 
        }
    }

    gotologin = () => {
        localStorage.removeItem("data");
        ReactDOM.render(<Login/>,document.getElementById("root"));
    }
    gotothis = () => {
        ReactDOM.render(<Send/>,document.getElementById("root"));
    }

    getOwn = () => {
        if (this.state.isOwner)
            return "You are Owner"
        else 
            return ""
    }

    getTrans = async(event) => {
        let data
        let trans = []; 
        try{
            // let myaccount = this.state.add;
            // let startBlockNumber = 0; 
            // let endBlockNumber = null;
            // const {web3} = this.state.web3;
            // let trans = [];
            // for (let i = startBlockNumber; i <= endBlockNumber; i++) {
            //     if (i % 100 == 0) {
            //         console.log("Searching block " + i);
            //     }
            //     const block = await web3.eth.getBlock(i, true);
            //     // console.log(block);
            //     if (block != null && block.transactions != null) {
            //         block.transactions.forEach( function(e) {
            //             if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
            //                 const temp = {hash : e.hash,
            //                     nonce           : e.nonce,
            //                     blockHash       : e.blockHash, 
            //                     blockNumber     : e.blockNumber, 
            //                     transactionIndex: e.transactionIndex, 
            //                     from            : e.from,
            //                     to              : e.to,
            //                     value           : e.value, 
            //                     time            : block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString(),
            //                     gasPrice        : e.gasPrice,
            //                     gas             : e.gas,
            //                 };
            //                 trans += JSON.stringify(temp);
            //                 // console.log(trans[1]);

            //             }
            //         });
            //     }
            // }

            console.log(trans);
            trans = this.state.transactions;
            console.log(trans);
            // for(int i=0; i<transn.length)
            //     console.log("this is new");
            //     alert(e);
            //     event.target.value += e;
            //     data += <div><h3>e</h3><br/></div>;
            // }
        }
        catch(e){
            console.log(e);
        }
        // data = <div>+data+</div>;
        // alert(data);

        // document.getElementById("history").innerHTML = trans;
        // if(data!=null)
        // return JSX.Element {
        //     <h1>No History</h1>
        // };
        ReactDOM.render(<data/>,document.getElementById("history"));
        
        // return <data>data</data>;
    }

    // getTransactions = async() => {
    //     let myaccount = this.state.add;
    //     let startBlockNumber = 0; 
    //     let endBlockNumber = null;
    //     const { web3 } = this.state;
    //     // const eth = await web3.eth;
    //     console.log('web3 : '+web3)
    //     console.log('ETH : '+web3.eth)
    //     if (endBlockNumber == null) {
    //       endBlockNumber = web3.eth.blockNumber;
    //       console.log("Using endBlockNumber: " + endBlockNumber);
    //     }
        // if (startBlockNumber == null) {
        //   startBlockNumber = endBlockNumber - 1000;
        //   console.log("Using startBlockNumber: " + startBlockNumber);
        // }
        // console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);
      
        // for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        //   if (i % 1000 == 0) {
        //     console.log("Searching block " + i);
        //   }
        //   var block = web3.eth.getBlock(i, true);
        //   if (block != null && block.transactions != null) {
        //     block.transactions.forEach( function(e) {
        //       if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
        //         console.log("  tx hash          : " + e.hash + "\n"
        //           + "   nonce           : " + e.nonce + "\n"
        //           + "   blockHash       : " + e.blockHash + "\n"
        //           + "   blockNumber     : " + e.blockNumber + "\n"
        //           + "   transactionIndex: " + e.transactionIndex + "\n"
        //           + "   from            : " + e.from + "\n" 
        //           + "   to              : " + e.to + "\n"
        //           + "   value           : " + e.value + "\n"
        //           + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
        //           + "   gasPrice        : " + e.gasPrice + "\n"
    //               + "   gas             : " + e.gas + "\n"
    //               + "   input           : " + e.input);
    //           }
    //         })
    //       }
    //     }
    //   }

    getfast(){
        return (
            <>hello</>
          );
    }
    render(){ 
        if(this.state.web3==null){
            return <h1>Server Not Started...</h1>;
        }
        // let transaction = [];
        // let trans = <li></li>;
        // transaction = this.state.transactions;
        // var i=transaction.length;
        // while(transaction.length-i<10){
        //     const temp = transaction[i];
        //     console.log(temp);
        //     let temp2 = <li></li>;
        //     // Object.keys(temp.object).map((key,i)=>{
        //     //     <p key={i}>
        //     //         <span>{key} : {temp.object[key]}</span>
        //     //     </p>
        //     // })
        //     trans += <li>{temp.hash}</li>;
        //     i--;
        // }
        // let trans2 = <ol>{trans}</ol>;
        return (
            <div>
                {/* style={{display: "block"}} */}
            <div className="container-login100 backImage" >
                <div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
                    <form onSubmit={this.validate} className="login100-form validate-form">
                        <span className="login100-form-title p-b-37">
                            Send Money<br></br><br></br>
                            <h5> Email : <p>{this.state.email}</p></h5>
                            <h5>Account : <p>{this.state.add}</p></h5>
                            <h5>Balance = {this.state.Balance}</h5>
                            <h5>{this.getOwn()}</h5>
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

            <div className="container-login100 backImage">
            <div className="transList p-l-55 p-r-55 p-t-30 p-b-30">
                <p className="text-center"><h2>History</h2></p> 
                <div className="transList text-center">
                    {/* <div className="container-login100-form-btn"> */}
                                <div id="history"><GetTreans/></div>
                    {/* </div> */}
                </div>
                <div className="text-center">
                                <a onClick={this.gotothis} className="txt2 hov1">
                                    Refresh
                                </a>
                </div>
                </div>
            </div>
            </div>
        );
    }
}
export default Send;
