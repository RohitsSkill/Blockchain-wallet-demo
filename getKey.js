const keythereum = require("keythereum");
const datadir = "C:/coursera/truffle/chain";             //key Folder path

const getKey = (add,pass) => {
    const address= "";          // Address
    const password = "";        // password

    try{
        const keyObject = keythereum.importFromFile(address, datadir);
        const privateKey = keythereum.recover(password, keyObject);
        console.log(privateKey.toString('hex'));
        return (privateKey.toString('hex'));
    }catch(e){
        console.log(e);
        return e;
    }
}

export default getKey;