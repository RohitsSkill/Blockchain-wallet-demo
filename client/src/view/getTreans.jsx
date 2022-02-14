import React, { Component } from "react";
import ReactDOM from 'react-dom';
import Login from "./login.jsx";
import walletContract from "../contracts/wallet.json";
import getWeb3 from "../getWeb3";

class getTreans extends Component{

    state = {
        transactions : null,
        trans: null,
        isSyncyng : true,
        contract:null,
        add: null,
    }
    componentDidMount = async () => {
        try {
            let data = localStorage.getItem("data");
            data = JSON.parse(data);
            // alert(`welcome ${data.email}`)
            console.log(data);

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
            


            let myaccount = data.accountNo;
            let startBlockNumber = 4000; 
            let endBlockNumber = null;
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
            
            // console.log(trans);
            this.setState({transactions:null, isSyncyng:false});
            // console.log(this.state.transactions);
            let transn = await instance.methods.retTrans().call({from:data.accountNo});
            console.log(transn);
            this.setState({add: data.accountNo, contract: instance, transactions: transn, isOwner:owner}, null);     


        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details. in send.jsx`,
            );
            console.error(error);
        }
    };

    getTime = (t) =>{
        var dt = new Date(t*1000);
        return dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
    }
    getDay = (t) =>{
        var dt = new Date(t*1000);
        var month = dt.getMonth()+1;
        return dt.getDate()+"/"+month+"/"+dt.getFullYear();
    }

    render(){
        if(this.state.isSyncyng){
            return <div className="transRow">It retriving your transactions please wait..!</div>
        }
        try{
            if(this.state.transactions == null){
                return <div className="transRow">Now Transactions</div>
            }
            else{
                let data = 
                    <table>
                        <tr><th className="text-center p-l-55 p-r-55">From</th> <th className="text-center">To</th><th className="text-center">Ammount</th><th className="text-center">Time</th><th className="text-center">Day</th></tr>
                            {this.state.transactions.map( (item, index) => (
                                <tr> 
                                    <td className="p-l-10 p-r-10">{item.from}</td>
                                    <td  className="p-l-10 p-r-10">{item.to}</td>
                                    <td>{item.ammount}</td>
                                    <td>{this.getTime(item.time)}</td>
                                    <td   className="p-l-10 p-r-10">{this.getDay(item.time)}</td>
                                </tr>
                            ))}
                    </table>
            
                return data;
            }
        }
        catch(e){
            console.log(e);
            return<div className="transRow">Error</div>
        }
    }
}
export default getTreans;
