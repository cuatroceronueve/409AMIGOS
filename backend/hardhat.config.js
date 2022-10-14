require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const {
  MAINNET_API_URL,
  GOERLI_API_URL,
  RINKEBY_API_URL,
  GANACHE_API_URL,
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
} = process.env;

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.1",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    ganache: {
      url: GANACHE_API_URL,
    },
    mainnet: {
      url: MAINNET_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 55000000000,
    },
    goerli: {
      url: GOERLI_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 1000000000,
    },
    rinkeby: {
      url: RINKEBY_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
