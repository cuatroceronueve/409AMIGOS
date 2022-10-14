import React, { useEffect, useState } from "react";
import useMetaMask from "../pages/hooks/metamask";
import Login from "./Login";
import { getUserOpenSea, abridgeAddress } from "../pages/utils/util";
import { useENSName } from "use-ens-name";

export default function WalletButton() {
  const { connect, disconnect, isActive, account } = useMetaMask() || {};
  const [userOpenSea, setUserOpenSea] = useState(null);
  const MyENSName = useENSName(account) || null;

  useEffect(() => {
    async function getOpenSea() {
      const response = await getUserOpenSea(account);
      const result = await response;

      setUserOpenSea(result);
    }
    getOpenSea();
  }, [account]);

  return (
    <div className='align-text-bottom mx-auto w-48 text-center'>
      <button
        onClick={connect}
        className={
          (isActive ? "hidden" : "") +
          " cursor-pointer lg:text-gray-500 text-white font-bold py-2 px-6 rounded-full align-middle transition duration-500 text-sm"
        }
      >
        {"CONNECT WALLET"}
      </button>
      <button
        onClick={disconnect}
        className={
          (isActive ? "" : "hidden") +
          " first:cursor-pointer lg:text-gray-500 text-white font-bold py-2 px-0 rounded-full align-middle transition duration-500 lg:hover:text-gray-700 text-sm"
        }
      >
        {isActive &&
          account &&
          (MyENSName || userOpenSea || abridgeAddress(account))}
      </button>
      <Login />
    </div>
  );
}
