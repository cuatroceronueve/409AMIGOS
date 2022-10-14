import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  mintWhitelist,
  tokenIsClaimed,
  mint409,
  callMintToken,
  getTokenAvatar,
} from "../pages/utils/_web3";
import MintCard from "./MintCard";
import { checkIsMerkleTreeValid, joinDataArray } from "../pages/utils/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import images from "./images.js";

/*
const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;
*/

export default function MintGallery() {
  const { active, account } = useWeb3React();
  //const [whitelistClaimable, setWhitelistClaimable] = useState(0);
  //const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [whitelistMintStatus, setWhitelistMintStatus] = useState();
  const [whitelistProof, setWhitelistProof] = useState([]);
  const [whitelistValid, setWhitelistValid] = useState(false);
  const [checkActive, setCheckActive] = useState([1]);
  const [tokenMinted, setTokenMinted] = useState([]);
  const [displayTokens, setDisplayTokens] = useState([]);

  const [tokenClaimed, setTokenClaimed] = useState(0);

  useEffect(() => {
    if (!active || !account) {
      //setAlreadyClaimed(false);
      setWhitelistValid(false);
      setWhitelistProof([]);
      return;
    }

    async function chackValidMerkleTree() {
      const { proof, valid } = await checkIsMerkleTreeValid(account);
      setWhitelistProof(proof);
      setWhitelistValid(valid);

      if (account) {
        const resultClaimed = await tokenIsClaimed(account);
        setTokenClaimed(resultClaimed);
      }
    }

    chackValidMerkleTree();
  }, [account, whitelistMintStatus]);

  useEffect(() => {
    async function getDataArray() {
      const { arrayTokens, tokensMinted } = await joinDataArray(account);

      setDisplayTokens(arrayTokens);
      setTokenMinted(tokensMinted);
    }

    getDataArray();
  }, [whitelistMintStatus]);

  const onMintWhitelist = async (tokenId) => {
    const { success } = await mintWhitelist(account, whitelistProof, tokenId);

    setWhitelistMintStatus(success);
  };

  return (
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
            All ({images.length})
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
            AMIGOS ({tokenMinted ? tokenMinted.length : images.length})
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
            Not minted ({images.length - tokenMinted.length})
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
              canMint={tokenClaimed}
              whitelist={whitelistValid}
              action={onMintWhitelist}
            />
          ))}
      </div>
    </div>
  );
}

/*
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
    async function checkTokenAvatar() {
      if (account) {
        const response = await getTokenAvatar(account);
        setTokenAvatar(response);
      }
    }

    checkTokenAvatar();
  }, [account]);

  useEffect(() => {
    async function checkIsTokenClaimed() {
      if (account) {
        const response = await tokenIsClaimed(account);
        setTokenClaimed(response);
      }
    }
    checkIsTokenClaimed();
  }, [account]);

 ---------------------
  useEffect(() => {
    if (!active || !account) {
      setAlreadyClaimed(false);
      return;
    }

    async function checkTokenIsClaimed() {
      const response = await callMintToken(account, whitelistProof, 0);
      setAlreadyClaimed(response);
    }

    checkTokenIsClaimed();
  }, [account]);

  
  useEffect(() => {
    (e) => {
      if (!active || !whitelistValid) {
        setWhitelistClaimable(NOT_CLAIMABLE);
        return;
      } else if (alreadyClaimed) {
        setWhitelistClaimable(ALREADY_CLAIMED);
        return;
      }
    };
    async function checkCallMintToken() {
      const response = await callMintToken(account, whitelistProof, 0);
      setWhitelistClaimable(response);
    }

    checkCallMintToken();
  }, [whitelistProof]);
*/

/*
<dataContext.Provider value={tokenContract}></dataContext.Provider>
owner:
(tokenMinted || []).findIndex(
(value) => value.token_id == item.token_id
) > -1
? tokenMinted.filter(
(value) => value.token_id == item.token_id
)[0].owner_of == null
? abridgeAddress(
tokenMinted.filter(
(value) => value.token_id == item.token_id
)[0].owner.address
)
: tokenMinted.filter(
(value) => value.token_id == item.token_id
)[0].owner_of
: null,
*/
