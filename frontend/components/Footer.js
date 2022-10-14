import React from "react";
import { FontAwesomeIcon }  from "../node_modules/@fortawesome/react-fontawesome";
import {
  faTwitter,
  faSpotify,
  faYoutube,
  faInstagram,
} from "../node_modules/@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className='bg-black'>    
      <div className=' bg-repeat-x h-6 relative -top-4 hidden'></div>

      <div className='container mx-auto text-center w-auto'>
        <div className='text-white'>
          <p className='pt-10 pb-5'>
            Si quieres conocer más acerca de nuestro contenido te invitamos a
            que nos sigas en nuestras redes sociales.
          </p>
        </div>
        <div className='pb-0'>
          <ul className='flex menu items-center justify-center gap-5'>
            <li>
              <a
                className='social-lg'
                target='_blank'
                href='https://twitter.com/cuatroceronueve'
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </li>
            <li>
              <a
                className='social-lg'
                target='_blank'
                href='https://open.spotify.com/artist/5N3uclenCzYXitAF8QkuFt'
              >
                <FontAwesomeIcon icon={faSpotify} />
              </a>
            </li>
            <li>
              <a
                className='social-lg'
                target='_blank'
                href='https://www.youtube.com/user/cuatroceronueve'
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </li>
            <li>
              <a
                className='social-lg'
                target='_blank'
                href='https://www.instagram.com/cuatroceronueve_/'
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
          </ul>
        </div>

        <div className='text-white pb-10'>
          <p className='py-2'>©2022 Cuatro Cero Nueve - 409</p>
        </div>
      </div>
    </div>
  );
}
