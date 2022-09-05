import Web3 from "web3";
require('dotenv').config();

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // window object is exist and window.web3 is exist
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        process.env.INFURA_PROVIDER
    );
    web3 = new Web3(provider);
}

export default web3;
