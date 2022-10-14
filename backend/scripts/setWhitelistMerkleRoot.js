require("dotenv").config();
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const axios = require("axios");

const API_URL = process.env.GOERLI_API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/Mint409.sol/Mint409.json");
const nftContract = new web3.eth.Contract(contract.abi, CONTRACT_ADDRESS);

async function setWhitelistMerkleRoot() {
  const generateWhitelistRoot = async () => {
    const url = "http://127.0.0.1:3000/api/getAddress";
    const response = await axios.get(url);
    const result = await response.data;
    const whitelist = result.map((item) => item.address);
    const whitelistLeafNodes = whitelist.map((addr) => keccak256(addr));
    const whitelistMerkleTree = new MerkleTree(whitelistLeafNodes, keccak256, {
      sortPairs: true,
    });
    const whitelistRootHash = whitelistMerkleTree.getHexRoot();
    console.log("whitelistRootHash", whitelistRootHash);
    return whitelistRootHash;
  };

  const root = await generateWhitelistRoot();
  let nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");

  const tx = {
    from: PUBLIC_KEY,
    to: CONTRACT_ADDRESS,
    nonce: nonce,
    gasPrice: 60000000000,
    gas: 200000,
    data: nftContract.methods.setWhitelistMerkleRoot(root).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
      console.log(
        `setWhitelistMerkleRoot is complete! Set root to ${root.toString(
          "hex"
        )}`
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

setWhitelistMerkleRoot();
