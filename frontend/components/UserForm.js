import Swal from "sweetalert2";
import Router from "next/router";
import React, { useState } from "react";

const UserForm = ({ updateData }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const clearForm = async () => {
    setName("");
    setAddress("");
  };

  const loadData = async () => {
    Toast.fire({
      icon: "success",
      title: "User registred",
    }).then(async (result) => {
      setName("");
      setAddress("");
      const resultData = await fetch(`/api/getUsers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const datax = await resultData.json();
      updateData(datax);
    });
  };

  const submitData = async (e) => {
    e.preventDefault();
    const body = { name, address };

    await fetch(`/api/postUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          Toast.fire({
            icon: "error",
            title: "Address duplicated",
          });
          throw new Error("Bad response from server");
        }
        return response;
      })
      .then(async (returnedResponse) => {
        loadData();
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  return (
    <div>
      <h2 className='text-gray-600 text-2xl text-center font-medium title-font mb-5'>
        REGISTRATION
      </h2>
      <form id='create-user-form' onSubmit={submitData}>
        <div className='relative mb-4'>
          <label
            htmlFor='full-name'
            className='leading-7 text-sm text-gray-500'
          >
            Full Name
          </label>
          <input
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            autoFocus
            onChange={(e) => setName(e.target.value)}
            type='text'
            value={name}
          />
        </div>
        <div className='relative mb-4'>
          <label htmlFor='address' className='leading-7 text-sm text-gray-500'>
            Address
          </label>
          <input
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
            onChange={(e) => setAddress(e.target.value)}
            type='text'
            value={address}
            pattern='^0x[a-fA-F0-9]{40}$'
          />
        </div>
        <div className='mb-0 mt-6 mx-auto flex justify-center gap-5'>
          <button
            disabled={!name || !address}
            type='submit'
            className={
              (!name || !address
                ? "cursor-default bg-gray-300  text-white"
                : "cursor-pointer bg-blue-900 text-white hover:text-white hover:bg-slate-900") +
              " text-white  border-0 py-2 px-8 focus:outline-none rounded text-base"
            }
          >
            {"Accept"}
          </button>

          <button
            disabled={!name && !address}
            onClick={clearForm}
            type='button'
            className={
              (!name && !address
                ? "cursor-default bg-gray-300  text-white"
                : "cursor-pointer bg-gray-600 text-white hover:text-white hover:bg-slate-900") +
              " text-white  border-0 py-2 px-8 focus:outline-none rounded text-base"
            }
          >
            {"Clear"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
