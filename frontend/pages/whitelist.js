import Head from "next/head";
import axios from "axios";
import useMetaMask from "../pages/hooks/metamask";
import React, { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import Separator from "../components/Separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faRemove } from "@fortawesome/free-solid-svg-icons";

const Whitelist = ({ data }) => {
  const { isActive, account } = useMetaMask() || {};
  const [filter, setFilter] = useState(data);
  const [query, setQuery] = useState("");
  const owner_address = process.env.NEXT_PUBLIC_OWNER_ACCOUNT;

  const goToSearch = async (e) => {
    e.preventDefault();

    const result = await fetch(`/api/getUser?query=${query}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    setFilter(await result.json());
  };

  const goToReset = async (e) => {
    e.preventDefault();
    const result = await fetch(`/api/getUsers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    setQuery("");
    setFilter(await result.json());
  };
 
  return (
    <div className='bg-white h-screen container mx-auto'>
      <Head>
        <title>Amigos 409</title>
        <meta name='description' content='Project 409' />
        <link rel='icon' href='icons8-music.svg' />
      </Head>
      <main>
        <Header />
        <Hero header='WHITELIST' />
        {!isActive || account !== owner_address ? (
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
              You don't have permission to access on this page
            </h1>
          </div>
        ) : (
          <div className='w-5/6 px-5 py-1 mx-auto flex flex-wrap items-top gap-x-14 mb-28'>
            <div className='lg:w-2/6 md:w-full bg-gray-200 rounded-lg p-8 h-max w-full mt-10 md:mt-0'>
              <UserForm updateData={setFilter} />
            </div>
            <div className='lg:w-3/5 md:w-full md:mt-0 lg:pr-0 pr-0'>
              <div className='my-0 mx-auto lg:text-right md:text-center sm:text-center lg:mt-0 md:mt-10 sm:mt-10 lg:'>
                <input
                  className='w-1/2 p-2 mx-3 mb-5 rounded-md border-2 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none text-gray-700'
                  placeholder='Search name or address'
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                ></input>
                <a
                  target='_blank'
                  className='cursor-pointer text-gray-500 ml-3'
                  onClick={goToSearch}
                >
                  <FontAwesomeIcon icon={faSearch} size='2x' rotation={90} />
                </a>
                <a
                  target='_blank'
                  className='cursor-pointer text-gray-500 ml-4'
                  onClick={goToReset}
                >
                  <FontAwesomeIcon icon={faTrash} size='2x' />
                </a>
              </div>
              <UserTable users={filter} updateData={setFilter} />
            </div>
          </div>
        )}
      </main>
      <Separator />
    </div>
  );
};

export const getServerSideProps = async () => {
  const { data } = await axios.get("http://localhost:3000/api/getUsers");
  return {
    props: { data },
  };
};

export default Whitelist;
