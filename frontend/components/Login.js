import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  callMintToken,
  getVerifyMerkleTree,
  tokenIsClaimed,
  getTokenAvatar,
} from "../pages/utils/_web3";
import { checkIsMerkleTreeValid } from "../pages/utils/util";

/*
const NOT_CLAIMABLE = 0;
const ALREADY_CLAIMED = 1;
const CLAIMABLE = 2;
*/

export default function Login() {
  const { active, account } = useWeb3React();
  //const [displayTokens, setDisplayTokens] = useState([]);
  //const [whitelistClaimable, setWhitelistClaimable] = useState(NOT_CLAIMABLE);
  //const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  //const [imageAvatar, setImageAvatar] = useState("");
  const [whitelistProof, setWhitelistProof] = useState([]);
  const [whitelistValid, setWhitelistValid] = useState(false);
  const [urlWhiteList, setUrlWhiteList] = useState(false);
  const [tokenAvatar, setTokenAvatar] = useState(false);
  const [tokenClaimed, setTokenClaimed] = useState(0);

  const OWNER_ADDRESS = process.env.NEXT_PUBLIC_OWNER_ACCOUNT;
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_ADDRESS;

  useEffect(() => {
    async function checkWhiteListPage() {
      setUrlWhiteList(window.location.pathname.includes("whitelist"));
    }

    checkWhiteListPage();
  }, []);

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
        const resultAvatar = await getTokenAvatar(account);
        setTokenAvatar(resultAvatar);

        const resultClaimed = await tokenIsClaimed(account);
        setTokenClaimed(resultClaimed);
      }
    }

    chackValidMerkleTree();
  }, [account]);

  return (
    <div className='lg:w-48 lg:absolute top-14 mb-0 mt-2 justify-center text-center text-gray-400 text-base md:pb-5 sm:pb-5'>
      {active && tokenAvatar && !urlWhiteList && (
        <div className='mx-auto'>
          <img
            className='mx-auto mb-4'
            src={`./tokens/${tokenAvatar}.png`}
            width='100'
            height='100'
          />
        </div>
      )}
      {active && !whitelistValid && (
        <div
          className='text-zinc-600 font-semibold p-2 leading-tight flex flex-col justify-center items-center mx-auto border border-solid border-neutral-400'
          style={{ width: "100px", height: "100px" }}
        >
          You are not yet on the mint list
        </div>
      )}
      {active && whitelistValid && !tokenClaimed && OWNER_ADDRESS != account && (
        <div
          className='text-zinc-600 font-semibold p-2 leading-tight flex flex-col justify-center items-center mx-auto border border-solid border-neutral-400'
          style={{ width: "100px", height: "100px" }}
        >
          You can mint the one you like
        </div>
      )}
    </div>
  );
}

/*
  useEffect(() => {
    async function checkTokenAvatar() {
      if (account) {
        const response = await getTokenAvatar(account);
        setTokenAvatar(response);

        const responseClaimed = await tokenIsClaimed(account);
        setTokenClaimed(responseClaimed);
      }
    }

    checkTokenAvatar();
  }, [account]);

  /*
  useEffect(() => {
    async function checkIsTokenClaimed() {
      if (account) {
        const response = await tokenIsClaimed(account);
        setTokenClaimed(response);
      }
    }
    checkIsTokenClaimed();
  }, [account]);
  */

/*
    (e) => {
      if (!active || !whitelistValid) {
        setWhitelistClaimable(NOT_CLAIMABLE);
        return;
      } else if (alreadyClaimed) {
        setWhitelistClaimable(ALREADY_CLAIMED);
        return;
      }
    };
    */

/*
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
ORIGINAL
return (
    <div className='lg:w-48 lg:absolute top-14 mb-0 mt-2 justify-center text-center text-gray-400 text-base md:pb-5 sm:pb-5'>
      {active && !urlWhiteList && (
        <div className={displayTokens.length > 0 ? "mx-auto" : "hidden"}>
          <img
            className='mx-auto mb-4'
            src={imageAvatar}
            width='100'
            height='100'
          />
        </div>
      )}
      {whitelistClaimable == 0 && active && (
        <div
          className='text-zinc-600 font-semibold p-2 leading-tight flex flex-col justify-center items-center mx-auto border border-solid border-neutral-400'
          style={{ width: "100px", height: "100px" }}
        >
          You are not yet on the mint list
        </div>
      )}
      {whitelistClaimable > 0 && active && (
        <>
          <div
            className={
              (whitelistClaimable == 2 && OWNER_ADDRESS != account
                ? "block"
                : "hidden") + " mx-auto"
            }
          >
            <div
              className='text-zinc-600 font-semibold p-2 leading-tight flex flex-col justify-center items-center mx-auto border border-solid border-neutral-400'
              style={{ width: "100px", height: "100px" }}
            >
              You can mint the one you like
            </div>
          </div>
        </>
      )}
    </div>
  );*/

/*
useEffect(() => {
if (!active || !account) {
return;
}
async function getContractInfo() {
setDisplayTokens([]);
setImageAvatar("");
const url =
process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
? `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${CONTRACT_ADDRESS}`
: `https://api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${CONTRACT_ADDRESS}`;

try {
const response = await axios.get(url);
const result = await response.data.assets;

if (result.length > 0) {
result.sort((a, b) => {
return Number.parseInt(b.token_id) - Number.parseInt(a.token_id);
});

setDisplayTokens(Array(result));
setImageAvatar(result[0].image_thumbnail_url);
}
} catch (err) {
console.error(err);
}
}
getContractInfo();
}, [account]);
*/

/*
return (
<div className='lg:w-48 lg:absolute top-14 mb-0 mt-2 justify-center text-center text-gray-400 text-base md:pb-5 sm:pb-5'>
{active && !urlWhiteList && (
<div className={displayTokens.length > 0 ? "mx-auto" : "hidden"}>
<img
className='mx-auto'
src={imageAvatar}
width='100'
height='100'
/>
</div>
)}
{whitelistClaimable > 0 && active && (
<>
<div
className={
(whitelistClaimable == 2 && OWNER_ADDRESS != account
? "block"
: "hidden") + " mx-auto"
}
>
<div className='text-red-500 lg:text-xs text-xs font-semibold mt-2 mx-auto'>
You have 1 mint free
</div>
<p className='lg:text-gray-400 text-white pt-2 lg:text-xs text-xs mx-auto px-10'>
All token with the word mint are available. <br></br>
<br></br>Choose the one you like.
</p>
</div>
</>
)}
</div>
);
*/

/*
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
*/
