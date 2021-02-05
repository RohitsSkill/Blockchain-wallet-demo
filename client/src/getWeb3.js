import Web3 from "web3";
import abi from "./contracts/wallet.json";
import net from 'net';
import Web3HttpProvider from 'web3-providers-http';

const getWeb3 = () =>{
  return new Promise(async(resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    
    // window.addEventListener("load", async () => {
    //   // Modern dapp browsers...
    //   if (window.ethereum) {
    //     const web3 = new Web3(window.ethereum);
    //     try {
    //       // Request account access if needed
    //       await window.ethereum.enable();
    //       // Acccounts now exposed
    //       resolve(web3);
    //     } catch (error) {
    //       //alert(error);
    //       reject(error);
    //     }
    //   }
    //   // Legacy dapp browsers...
    //   else 
    //   if (window.web3) {
    //     // Use Mist/MetaMask's provider.
    //     const web3 = window.web3;
    //     console.log("Injected web3 detected.");
    //     resolve(web3);
    //   }
    //   // Fallback to localhost; use dev console port by default...
    //   else {



        // const provider = new Web3.providers.HttpProvider(
        //   "http://127.0.0.1:8543"
        // );
        // const web3 = new Web3(provider);





        const options = {
          keepAlive: true,
          withCredentials: false,
          timeout: 20000, // ms
          headers: [
              {
                  name: 'Access-Control-Allow-Origin',
                  value: '*'
              }
          ],
          // agent: {
          //     http: http.Agent(),
          //     baseUrl: ''
          // }
      };
      
      const provider = new Web3HttpProvider('http://localhost:8543', options);
      const web3 = new Web3(provider);


      
        // const web3 = new Web3(new Web3.providers.IpcProvider('http://localhost:8543', net)); // mac os path
        // console.log("No web3 instance injected, using Local web3.");
        // resolve(web3);
        
        // const contractAddr = '0x0D117422C5bf3ed9f5D281427A91017562505520';
        // const web = new web3.eth.Contract(abi.abi, contractAddr);
        console.log(web3);
        resolve(web3);
      // }
    // });
   });
}

export default getWeb3;
