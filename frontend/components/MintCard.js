import React from "react";
import Swal from "sweetalert2";
import { abridgeAddress } from "../pages/utils/util";

export default function MintCard({
  identificador,
  picture,
  available,
  owner,
  canMint,
  whitelist,
  action,
}) {
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

  return (
    <div className='h-full border-0 border-gray-100 border-opacity-60 overflow-hidden'>
      <div className='pt-2 pb-1 flex items-center text-center justify-between px-1'>
        <span className='tracking-normal lg:text-md text-sm title-font font-normal text-gray-500 mb-0 text-center'>
          {String(`${identificador}`).padStart(3, "0")}
        </span>
        <div className='flex items-center text-center justify-center'>
          <a
            onClick={() => action(`${identificador}`)}
            className={
              canMint || owner || !available || !whitelist
                ? "hidden"
                : "" +
                  "text-gray-500 inline-flex items-center lg:mb-0 cursor-pointer lg:text-md text-sm"
            }
          >
            mint
          </a>
        </div>
      </div>
      <img
        className='lg:h-auto md:h-36 sm:h-36 w-full object-cover object-center'
        onClick={(event) => popupImage(event, `${picture}`)}
        src={picture}
        alt='blog'
      />

      <p className='text-gray-500 text-center text-sm pt-2'>
        {owner != null && abridgeAddress(owner)}
      </p>
    </div>
  );
}

/*
//!canMint || contract || !available
              
const [userOpenSea, setUserOpenSea] = useState();
useEffect(() => {
async function getOpenSea() {
if (owner != null) {
const response = await getUserOpenSea(owner);
setUserOpenSea(response);
}
}
getOpenSea();
}, [owner]);
*/

/*
{(tokenMinted || [])
.filter((value) => {
return value.tokenId == identificador;
})
.map((token) => {
return (
//useENSName(token.owner) || abridgeAddress(token.owner) || owner
useENSName(token.owner) || abridgeAddress(token.owner)            
);
})}
*/
