require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');
const provider = new HDWalletProvider( process.env.PRIVATE_WALLET_KEY,
  process.env.INFURA_PROVIDER
);
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: compiledFactory.bytecode})
      .send({ from: accounts[0], gas: "1000000" });

    console.log("Contract deployed to:", result.options.address);
    provider.engine.stop();
  } catch (error) {
    console.log(error);
  }
};
deploy();
