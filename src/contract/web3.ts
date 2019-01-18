import logger from "utils/logger";

const Web3       = require("web3");
const EthereumTx = require("ethereumjs-tx");
const fs         = require("fs");

const rpcURL = "https://rinkeby.infura.io/v3/" + fs.readFileSync("./src/contract/.infura");
const web3   = new Web3(new Web3.providers.HttpProvider(rpcURL));

const userAddress     = "0x169BB8bD41EF1FcAB4593F3B999A9069D370B870";
const privateKey       = Buffer.from(fs.readFileSync("./src/contract/.privateKey", "utf8"), "hex")
const contractAddress = "0x22203250E732679557b61B8F567903dBF7d1fF93";
const contractABI = [{"constant":true,"inputs":[],"name":"userCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userMap","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"manager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"CheckUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"AddUser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"GetUserCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const instance        = new web3.eth.Contract(contractABI, contractAddress, {
    from: userAddress
});

const AddUser = (user) => {
    return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(userAddress, (err, nonce) => {
            const data = instance.methods.AddUser(user).encodeABI();

            const tx = new EthereumTx({
                nonce,
                gasPrice: web3.utils.toHex(web3.utils.toWei("20", "gwei")),
                gasLimit: 100000,
                to: contractAddress,
                value: 0,
                data,
            });
            tx.sign(privateKey);

            const raw = "0x" + tx.serialize().toString("hex");
            web3.eth.sendSignedTransaction(raw, (err2, transactionHash) => {
                if (err2) {
                    reject("Error Occur");
                }
                else{
                    logger.info(transactionHash);
                    resolve(transactionHash);
                }             
            });
        });
    });
}

const CheckUser = (user)=>{
    return new Promise((resolve, reject)=>{
        instance.methods.CheckUser(user).call({
            from: userAddress
        }, (err, result) => {
            if (err) {
                logger.error(err);
                reject("Error occur");
            }
            else {
                logger.info("Checkuser(" + user + "): " + result);
                resolve(result);
            }
        });
    });
}


const GetUserCount = ()=>{
    return new Promise((resolve, reject)=>{
        instance.methods.GetUserCount().call({
            from: userAddress
        }, (err, result)=>{
            if(err){
                logger.error(err);
                reject("Error occur");
            }
            else{
                logger.info("User count: " + result);
                resolve(result);
            }
        });
    });
}

export {
    AddUser,
    CheckUser,
    GetUserCount
}