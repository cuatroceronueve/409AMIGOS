import axios from "axios";
import images from "../../components/images";
import arrayDisponibles from "../../data/availables.json";

export const checkIsMerkleTreeValid = async (account) => {
  const { MerkleTree } = require("merkletreejs");
  const keccak256 = require("keccak256");
  const url = "http://127.0.0.1:3000/api/getAddress";
  const response = await axios.get(url);
  const result = await response.data;
  const whitelist = result.map((item) => item.address);
  const whitelistLeafNodes = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(whitelistLeafNodes, keccak256, {
    sortPairs: true,
  });
  const hashedAddress = keccak256(account);
  const proof = merkleTree.getHexProof(hashedAddress);
  const root = merkleTree.getHexRoot();
  const valid = merkleTree.verify(proof, hashedAddress, root);

  return {
    proof,
    valid,
  };
};

export const getUserOpenSea = async (account) => {
  const url =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
      ? `https://testnets-api.opensea.io/api/v1/user/${account}`
      : `https://api.opensea.io/api/v1/user/${account}`;

  try {
    const response = await axios.get(url);
    return await response.data.username;
  } catch (err) {
    return null;
  }
};

export const joinDataArray = async () => {
  const tokensMinted = await getTokensMoralis();

  const arrayTokens = images.map((item) => ({
    ...item,
    available:
      arrayDisponibles.filter((value) => value == -1).length == 1
        ? true
        : arrayDisponibles.filter((value) => value == 0).length == 1
        ? false
        : arrayDisponibles.filter((value) => value == item.token_id) > 0
        ? true
        : false,
    minted:
      (tokensMinted || []).findIndex(
        (value) => value.token_id == item.token_id
      ) > -1
        ? true
        : false,
    owner:
      (tokensMinted || []).findIndex(
        (value) => value.token_id == item.token_id
      ) > -1
        ? tokensMinted.filter((value) => value.token_id == item.token_id)[0]
            .owner_of
        : null,
  }));
  return { arrayTokens, tokensMinted };
};

export const getTokensMoralis = async () => {
  const options = {
    method: "GET",
    url: `https://deep-index.moralis.io/api/v2/nft/${process.env.NEXT_PUBLIC_NFT_ADDRESS}/owners`,
    params: { chain: "goerli", format: "decimal" },
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API,
    },
  };

  try {
    const response = await axios.request(options);
    return await response.data.result;
  } catch (err) {
    return null;
  }
};

export function abridgeAddress(hex, length = 5) {
  return `${hex.substring(0, length + 3)}`;
}
