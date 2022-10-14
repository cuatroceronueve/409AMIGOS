import Web3 from "web3";
import React, { useState, useEffect } from "react";

const NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS;
const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../../data/Mint409.json");
const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;

export const mint409 = new web3.eth.Contract(contractABI.abi, NFT_ADDRESS);

export const getTokenAvatar = async (account) => {
  const result = mint409.methods
    .tokenAvatar(account)
    .call({ from: account })
    .then((result) => {
      return result > 0 ? result : false;
    })
    .catch((err) => {
      return false;
    });

  return result;
};

export const tokenIsClaimed = async (account) => {
  const result = mint409.methods
    .claimed(account)
    .call({ from: account })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return false;
    });

  return result;
};

export const getVerifyMerkleTree = async (proof, account) => {
  const result = mint409.methods
    .verifyMerkleTree(proof)
    .call({ from: account })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });

  return result;
};

export const mintWhitelist = async (account, proof, tokenId) => {
  const result = mint409.methods
    .mintWhitelist(proof, tokenId)
    .send({ from: account })
    .then((result) => {
      return {
        success: true,
        status:
          `Check out your transaction on Etherscan: https://etherscan.io/tx/` +
          result.blockHash,
      };
    })
    .catch((err) => {
      return {
        success: false,
        status: "Something went wrong: " + err.message,
      };
    })
    .finally((result) => {
      return result;
    });
  return result;
};

export const mintTokenTransfer = async (to, from, tokenId) => {
  const result = mint409.methods
    .mintTransfer(to, tokenId)
    .send({ from: from })
    .then((result) => {
      return {
        success: true,
        blockhash: result.blockHash,
        status: `Transaction succesful` + result.blockHash,
      };
    })
    .catch((err) => {
      return {
        success: false,
        blockhash: err,
        status: "Transaction has been reverted by the EVM.",
      };
    })
    .finally((result) => {
      return result;
    });
  return result;
};

export const checkOwnerToken = async (tokenId) => {
  const result = await mint409.methods
    .ownerOf(tokenId)
    .call()
    .then(function (response) {
      return true;
    })
    .catch((err) => {
      return false;
    });

  return result;
};

export const useENSName = (library, address) => {
  const [ENSName, setENSName] = useState("");
  useEffect(() => {
    if (library && typeof address === "string") {
      let stale = false;

      library
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === "string") {
            setENSName(name);
          }
        })
        .catch(() => {});

      return () => {
        stale = true;
        setENSName("");
      };
    }
  }, [library, address]);

  return ENSName;
};

export default function blank() {
  return <></>;
}

/*
export const callMintToken = async (account, proof, tokenId) => {
  const result = await mint409.methods
    .mintWhitelist(proof, tokenId)
    .call({ from: account })
    .then(() => {
      return CLAIMABLE;
    })
    .catch((err) => {
      if (err.toString().includes("Only one token is allowed per address")) {
        return ALREADY_CLAIMED;
      } else {
        return NOT_CLAIMABLE;
      }
    });

  return result;
};
*/

/*
export const checkOwnerToken = async (tokenId) => {
  const result = await mint409.methods
    .ownerOf(tokenId)
    .call()
    .then(function (response) {
      try {
        return true;
      } catch {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });

  return result;
};
*/

/*
export const setTransferToken = async (from, to, tokenId, account) => {
  const result = await mint409.methods
    .transferFrom(from, to, tokenId)
    .send({ from: account })
    .then(function (res) {
      return res;
    })
    .catch((err) => {
      return null;
    });

  return result;
};
*/

/*
export const getTokenMinted = async () => {
  const result = await mint409.methods
    .getNFTs()
    .call()
    .then(function (res) {
      return res;
    })
    .catch((err) => {
      return null;
    });

  return result;
};
*/
