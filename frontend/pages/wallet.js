import Head from "next/head";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { setTransferToken, mint409 } from "../pages/utils/_web3";
import axios from "axios";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faRemove } from "@fortawesome/free-solid-svg-icons";
import BeatLoader from "react-spinners/BeatLoader";

const Wallet = () => {
  const { active, account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [displayTokens, setDisplayTokens] = useState([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const owner_address = process.env.NEXT_PUBLIC_OWNER_ACCOUNT;
  const contract_address = process.env.NEXT_PUBLIC_NFT_ADDRESS;

  const popupForm = (event) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Swal.fire({
      title: "Transfer token NFT",
      html: `
      <input type="text" id="id" readonly class="read-only:bg-gray-100 w-5/6 p-2 mx-2 mb-5 rounded-md border-2 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700" placeholder="ID Token" value="${event}">
      <input type="text" id="from" readonly class="read-only:bg-gray-100 text-base w-5/6 p-2 mx-2 mb-5 rounded-md border-2 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700" placeholder="From" value="${owner_address}">
      <input type="text" id="to" pattern='^0x[a-fA-F0-9]{40}$' class="w-5/6 p-2 mx-2 mb-5 text-base rounded-md border-2 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700" placeholder="To" >`,
      confirmButtonText: "Transfer",
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const from = Swal.getPopup().querySelector("#from").value;
        const to = Swal.getPopup().querySelector("#to").value;
        if (!from || !to) {
          Swal.showValidationMessage(`Please enter [To] address`);
        }
        return { from: from, to: to };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        (async function () {
          await setTransferToken(from.value, to.value, event, owner_address)
            .then((result) => {
              Toast.fire({
                icon: "success",
                title: "Transfer successful",
              });
            })
            .catch((err) => {
              Toast.fire({
                icon: "error",
                title: "Error: " + err.code,
              });
            });
        })();
      }
    });
  };

  const popupImage = (event) => {
    Swal.fire({
      imageUrl: event.target.src,
      imageWidth: 409,
      imageHeight: 409,
      showCloseButton: false,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Close",
      focusConfirm: false,
      imageAlt: "TOKEN AMIGO",
      onOpen: () => Swal.disableConfirmButton(),
    });
  };

  useEffect(() => {
    if (!active || !account) {
      return;
    }
    async function checkNFTBalance() {
      mint409.methods
        .balanceOf(account)
        .call()
        .then((result) => {
          const resultFloat = parseFloat(result, 10);
          setTokenBalance(resultFloat);
        })
        .catch((err) => {
          console.error("err", err);
          setTokenBalance(0);
        });
    }
    checkNFTBalance();
  }, [account]);

  useEffect(() => {
    if (!active || !account) {
      return;
    }
    setLoading(true);
    async function getContractInfo() {
      const url =
        process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
          ? `https://testnets-api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${contract_address}`
          : `https://api.opensea.io/api/v1/assets?owner=${account}&asset_contract_address=${contract_address}`;

      try {
        const response = await axios.get(url);
        const result = await response.data.assets;
        setDisplayTokens(Array(result));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    getContractInfo();
  }, [account]);

  return (
    <div className='bg-white h-full container mx-auto'>
      <Head>
        <title>Amigos 409</title>
        <meta name='description' content='Project 409' />
        <link rel='icon' href='icons8-music.svg' />
      </Head>
      <main>
        <Header />
        <Hero header='WALLET' />
        {loading ? (
          <div className='h-auto py-20 text-center '>
            <BeatLoader color='#909090' loading={loading} size={20} />
          </div>
        ) : !active || account !== owner_address ? (
          <div className='h-auto py-20 text-center'>
            <FontAwesomeIcon
              icon={faRemove}
              size='4x'
              className='text-red-700 mb-3'
            />
            <h1 className='text-gray-600 text-center text-3xl py-5'>
              ACCESS DENIED
            </h1>
            <h1 className='text-gray-500 text-center'>
              You don't have permission to access on this page.
            </h1>
          </div>
        ) : tokenBalance <= 0 ? (
          <div className='h-auto py-20 text-center'>
            <FontAwesomeIcon
              icon={faWallet}
              size='4x'
              className='text-gray-400 mb-3'
            />
            <h1 className='text-gray-600 text-center text-3xl py-5'>
              EMPTY WALLET
            </h1>
            <h1 className='text-gray-500 text-center'>
              You don't have token yet.
            </h1>
          </div>
        ) : (
          <div>
            <div className='pt-8 py-44'>
              <div className='grid w-5/6 mx-auto xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-6 gap-9'>
                {displayTokens[0]?.map((token, index) => (
                  <div
                    key={index}
                    className='h-full border-0 border-gray-100 border-opacity-60 overflow-hidden'
                  >
                    <div className='pt-2 pb-1 flex items-center text-center justify-between px-1'>
                      <span className='tracking-normal text-base title-font font-normal text-gray-500 mb-0 text-center'>
                        {String(`${token.token_id}`).padStart(3, "0")}
                      </span>
                      <div className='flex items-center text-center justify-center'>
                        <a
                          onClick={() => popupForm(`${token.token_id}`)}
                          className='text-gray-500 inline-flex items-center md:mb-2 lg:mb-0 cursor-pointer'
                        >
                          transfer
                        </a>
                      </div>
                    </div>
                    <img
                      className='lg:h-auto md:h-36 sm:h-36 xm:h-20 w-full object-cover object-center'
                      onClick={(event) =>
                        popupImage(event, `${token.image_url}`)
                      }
                      src={token.image_url}
                      alt='blog'
                    />
                    <p className='text-gray-500 text-center text-sm pt-2'>
                      {token.owner.user.username}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;
