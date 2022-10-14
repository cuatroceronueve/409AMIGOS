import React, { useState } from "react";

const UserSearch = (props) => {
  return (
    <div>
      <input placeholder="Search name or address"></input>
      <button className='bg-black p-2 mx-3 mb-3 rounded-md border-2 border-yellow-300 text-white'>
        Click me
      </button>
    </div>
  );
};

export default UserSearch;
