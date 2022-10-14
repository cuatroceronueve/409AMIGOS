import useMetaMask from "../pages/hooks/metamask";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { mintTokenTransfer, checkOwnerToken } from "../pages/utils/_web3";
import WalletButton from "./WalletButton";
import Link from "next/link";
import Swal from "sweetalert2";

const Header = () => {
  const { isActive, account } = useMetaMask() || {};
  const [hiddenMenu, setHiddenMenu] = useState(true);
  const owner_address = process.env.NEXT_PUBLIC_OWNER_ACCOUNT;

  const popupForm = () => {
    Swal.fire({
      title: "Transfer token",
      html: `
      <input type="text" id="id" class="w-5/6 p-2 mx-2 mb-5 rounded-md border-2 text-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 outline-none text-gray-700" placeholder="ID Token">
      <input type="text" id="to" pattern='^0x[a-fA-F0-9]{40}$' class="w-5/6 p-2 mx-2 mb-5 text-sm rounded-md border-2 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 outline-none text-gray-700" placeholder="To" >
      <input type="text" id="from" readonly class="read-only:bg-gray-100 text-sm w-5/6 p-2 mx-2 mb-5 rounded-md border-2 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 outline-none text-gray-700" placeholder="From" value="${owner_address}">`,

      confirmButtonText: "Transfer",
      confirmButtonColor: "#1e3a8a",
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: async () => {
        const id = Swal.getPopup().querySelector("#id").value;
        const to = Swal.getPopup().querySelector("#to").value;
        if (!id || !to) {
          Swal.showValidationMessage(
            `Please enter all data [To address and Token Id are required]`
          );
        }
        if (id > 0 && to) {
          const validaToken = await checkOwnerToken(id);
          if (validaToken) {
            Swal.showValidationMessage(`Token #${id} has been assigned`);
          }
        }
        if (id > 409 && to) {
          Swal.showValidationMessage(`Max. token Id 409`);
        }
        return { tokenId: id, to: to };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        (async function () {
          await mintTokenTransfer(to.value, from.value, id.value)
            .then((result) => {
              Swal.fire({
                icon: result.success ? "success" : "error",
                title: result.success
                  ? "Transaction succesful"
                  : "Transaction failed",
                text: `Transaction hash: ${result.blockhash}`,
                confirmButtonColor: "#1e3a8a",
              });
            })
            .catch((e) => {
              Swal.fire({
                icon: "error",
                title: "Transaction failed",
                text: e,
              });
            });
        })();
      }
    });
  };

  return (
    <div className='flex justify-between lg:justify-center items-center mx-auto w-full'>
      <div className='flex flex-beteew p-6 w-1/4'>
        <ul className='flex menu items-start justify-start gap-3'>
          <li>
            <Link href='https://cuatroceronueve.io'>
              <a target='_blank' className='social'>
                <FontAwesomeIcon icon={faGlobe} />
              </a>
            </Link>
          </li>
          <li>
            <Link href='https://discord.gg/B9Z37vYnNv'>
              <a target='_blank' className='social'>
                <FontAwesomeIcon icon={faDiscord} />
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className='lg:block hidden w-5/6 md:w-4/6'>
        <ul className='flex items-center justify-end gap-3'>
          <li
            className={!isActive || account !== owner_address ? "hidden" : ""}
          >
            <Link href='/'>
              <a className='link'>Home</a>
            </Link>
          </li>
          <li
            className={!isActive || account !== owner_address ? "hidden" : ""}
          >
            <Link href='/whitelist'>
              <a className='link'>Whitelist</a>
            </Link>
          </li>
          <li
            className={!isActive || account !== owner_address ? "hidden" : ""}
          >
            <a className='link' onClick={() => popupForm()}>
              Transfer
            </a>
          </li>
          <li className='flex'>
            <WalletButton />
          </li>
        </ul>
      </div>
      <div className='block lg:hidden lg:w-4/6'>
        <a
          href='#'
          className='link'
          id='mobile-menu'
          onClick={() => setHiddenMenu(!hiddenMenu)}
        >
          Menu
        </a>
        <ul
          className={
            (hiddenMenu ? "hidden" : "") +
            " mobile-links w-full absolute z-50 left-0 text-center bg-gray-800 "
          }
        >
          <li
            className={!isActive || account !== owner_address ? "hidden" : ""}
          >
            <Link href='/'>
              <a className='social-menu'>Home</a>
            </Link>
          </li>
          <li
            className={!isActive || account !== owner_address ? "hidden" : ""}
          >
            <Link href='/whitelist'>
              <a className='social-menu'>Whitelist</a>
            </Link>
          </li>
          <li
            className={!isActive || account !== owner_address ? "hidden" : ""}
          >
            <a href='#' className='social-menu' onClick={() => popupForm()}>
              Transfer
            </a>
          </li>
          <li>
            <WalletButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
