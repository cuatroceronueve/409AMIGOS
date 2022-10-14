import { Fragment } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import MintGallery from "../components/MintGallery";

export default function Home() {
  return (
    <div className='bg-white h-screen container mx-auto'>
      <Head>
        <title>409 Amigos</title>
        <meta name='description' content='Project 409' />
        <link rel='icon' />
      </Head>

      <main>
        <Header />
        <Hero
          header='409 AMIGOS'
          message={
            <Fragment>
              AMIGOS are 409 friends, artists and enthusiasts who love IDM,
              experimental techno, glitch, noise and electronic. Some of them
              may like 409 music and everyone is taking part in his music quest.
              <br />
              <br />
              This unique member token gives you access to the Discord where we
              will form a community to interact and collaborate. I will try hard
              to distribute this membership to people who really belong to this
              community.
              <br />
              <br />
              You can apply for one
              <a className='text-pink-600 cursor-pointer font-bold'>
                {" "}
                here.
              </a>{" "}
              If you are selected you will be able to mint one AMIGO of your
              choice.
            </Fragment>
          }
        />
        <MintGallery />
      </main>
    </div>
  );
}
