import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  mintWhitelist,
  abridgeAddress,
  getTokenMinted,
  mint409,
} from "../pages/utils/_web3";
import images from "./images.js";
import arrayDisponibles from "../data/availables.json";
import { checkIsMerkleTreeValid } from "../pages/utils/util";
import axios from "axios";
import MintCard from "./MintCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export const dataContext = React.createContext();

const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;

export default function MintGallery() {
  const contract_address = process.env.NEXT_PUBLIC_NFT_ADDRESS;
  const { active, account } = useWeb3React();
  const [whitelistClaimable, setWhitelistClaimable] = useState(NOT_CLAIMABLE);
  const [whitelistMintStatus, setWhitelistMintStatus] = useState();
  const [tokenMinted, setTokenMinted] = useState([]);
  const [tokenContract, setTokenContract] = useState([]);
  const [displayTokens, setDisplayTokens] = useState([]);
  const [whitelistProof, setWhitelistProof] = useState([]);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [whitelistValid, setWhitelistValid] = useState(false);
  const [checkActive, setCheckActive] = useState([1]);

  useEffect(() => {
    async function getTokensMinted() {
      await new Promise((resolve, reject) => {
        getTokenMinted().then((res) => {
          setTokenContract(res);
        });
      });
    }
    getTokensMinted();
  }, [whitelistMintStatus, tokenMinted, account]);

  useEffect(() => {
    if (!active || !account) {
      setAlreadyClaimed(false);
      setWhitelistValid(false);
      setWhitelistProof([]);
      return;
    }
    async function chackValidMerkleTree() {
      const { proof, valid } = await checkIsMerkleTreeValid(account);
      setWhitelistProof(proof);
      setWhitelistValid(valid);
    }

    chackValidMerkleTree();
  }, [account]);

  useEffect(() => {
    if (!active || !account) {
      setAlreadyClaimed(false);
      return;
    }
    async function checkIfClaimed() {
      mint409.methods
        .claimed(account)
        .call({ from: account })
        .then((result) => {
          setAlreadyClaimed(result);
        })
        .catch((err) => {
          setAlreadyClaimed(false);
        });
    }
    checkIfClaimed();
  }, [account]);

  useEffect(() => {
    async function getTokensOpenSea() {
      const url =
        process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
          ? `https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=${contract_address}`
          : `https://api.opensea.io/api/v1/assets?asset_contract_address=${contract_address}`;

      try {
        const response = await axios.get(url);
        const result = await response.data.assets;
        setTokenMinted(result);
      } catch (err) {
        setTokenMinted([]);
      }
    }
    getTokensOpenSea();
  }, [whitelistMintStatus]);

  useEffect(
    (e) => {
      if (!active || !whitelistValid) {
        setWhitelistClaimable(NOT_CLAIMABLE);
        return;
      } else if (alreadyClaimed) {
        setWhitelistClaimable(ALREADY_CLAIMED);
        return;
      }
      async function validateClaim() {
        mint409.methods
          .mintWhitelist(whitelistProof, 0)
          .call({ from: account })
          .then(() => {
            setWhitelistClaimable(CLAIMABLE);
          })
          .catch((err) => {
            if (
              err.toString().includes("Only one token is allowed per address")
            ) {
              setWhitelistClaimable(ALREADY_CLAIMED);
            } else {
              setWhitelistClaimable(NOT_CLAIMABLE);
            }
          });
      }
      validateClaim();
    },
    [whitelistProof]
  );

  useEffect(() => {
    async function checkIfAvailableMinted() {
      setDisplayTokens(
        images.map((item) => ({
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
            tokenMinted.findIndex((value) => value.token_id == item.token_id) >
            -1
              ? true
              : false,
          owner:
            tokenMinted.findIndex((value) => value.token_id == item.token_id) >
            -1
              ? tokenMinted.filter(
                  (value) => value.token_id == item.token_id
                )[0].owner.user == null
                ? abridgeAddress(
                    tokenMinted.filter(
                      (value) => value.token_id == item.token_id
                    )[0].owner.address
                  )
                : tokenMinted.filter(
                    (value) => value.token_id == item.token_id
                  )[0].owner.user.username
              : null,
          contract:
            (tokenContract || []).filter(
              (value) => value.tokenId == item.token_id
            ).length > 0
              ? true
              : false,
        }))
      );
    }
    checkIfAvailableMinted();
  }, [tokenMinted, tokenContract]);

  const onMintWhitelist = async (tokenId) => {
    const { success } = await mintWhitelist(account, whitelistProof, tokenId);

    setWhitelistMintStatus(success);
  };

  return (
    <dataContext.Provider value={tokenContract}>
      <div className='pt-8 py-44'>
        <div className='mx-auto mb-6 mt-3 lg:px-24 px-6 flex items-center text-center lg:justify-start justify-center lg:gap-5 gap-3 text-gray-400 lg:text-md text-sm'>
          <div className='text-gray-500'>
            <FontAwesomeIcon icon={faFilter} />
          </div>
          <div>
            <input
              type='checkbox'
              id='allToken'
              name='allToken'
              value='allToken'
              checked={checkActive == 1}
              onChange={() => setCheckActive([1])}
            />
            <label htmlFor='allToken' className='ml-1 text-gray-500'>
              All ({displayTokens.length})
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='allMinted'
              name='allToken'
              value='allMinted'
              checked={checkActive == 2}
              onChange={() => setCheckActive([2])}
            />
            <label htmlFor='allMinted' className='ml-1 text-gray-500'>
              AMIGOS ({tokenMinted ? tokenMinted.length : 20})
            </label>
          </div>
          <div>
            <input
              type='checkbox'
              id='allMinted'
              name='allToken'
              value='allMinted'
              checked={checkActive == 3}
              onChange={() => setCheckActive([3])}
            />
            <label htmlFor='notMinted' className='ml-1 text-gray-500'>
              Not minted ({displayTokens.length - tokenMinted.length})
            </label>
          </div>
        </div>
        <div className='grid max-w-max px-[70px] gap-8 mx-auto xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 '>
          {displayTokens
            .filter((filtro) =>
              checkActive == 1
                ? !filtro.minted || filtro.minted
                : checkActive == 2
                ? filtro.minted
                : checkActive == 3
                ? !filtro.minted
                : displayTokens
            )
            .map((item) => (
              <MintCard
                identificador={item.token_id}
                picture={item.image}
                key={item.token_id}
                available={item.available}
                token={item.minted}
                owner={item.owner}
                contract={item.contract}
                canMint={whitelistClaimable}
                action={onMintWhitelist}
                //minteado={tokenContract}
              />
            ))}
        </div>
      </div>
    </dataContext.Provider>
  );
}
