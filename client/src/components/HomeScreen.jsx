import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { UsersList , ChatBox , LogoutButton} from "./index"
import { Search } from "lucide-react";

const HomeScreen = () => {
  const currentUser = useSelector((state) => state.User?.loggedInUser);
  const [searchValue, setSearchValue] = useState(""); // State for search input
  // State to control panel visibility
  const [isUserSelected, setIsUserSelected] = useState(false);

  // Function to handle user click (passed to UsersList)
  const handleUserClick = () => {

    // console.log(`user clicked`)
    setIsUserSelected(true);
  };

  const handleBackHome = () => {

    setIsUserSelected(false);
    // console.log(`back Home`);

    // return (
    //   // console.log(`home back return`)
    // )
  }

  return (
    <div className="flex h-screen bg-base-200">


      {/* Left Panel - Users List */}

      


      <div
  className={`w-full md:w-1/3 border-r h-screen border-base-300 bg-base-100 flex flex-col ${
    isUserSelected ? "hidden" : ""
  } md:block`}
>
<div className='h-40'>
  {/* Header with user profile and logout button */}
  <div className="p-4 border-b border-base-300 bg-green-200 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="avatar">
        <div className="w-10 rounded-full">
          <img src={currentUser?.profilePic || "default-avatar-url"} alt="Profile" />
        </div>
      </div>
      <h2 className="font-semibold">{currentUser?.userName}</h2>
    </div>
    <LogoutButton />
  </div>

  {/* Search Bar */}
  <div className="p-4 border-b border-base-300">
    <div className="form-control">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search users..."
          className="input input-bordered w-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className="btn btn-square flex items-center justify-center">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>


  </div>

  {/* User List */}
  <div className="">
    <UsersList onUserClick={handleUserClick} searchValue={searchValue} className=''/>
  </div>
</div>



      {/* Right Panel - ChatBox (Visible only on larger screens or when a user is clicked) */}
      <div className={` ${isUserSelected ? "block" : "hidden"} w-full md:block md:h-screen md:w-2/3`}>
        <ChatBox back={handleBackHome}/>
      </div>
    </div>
  );
};

export default HomeScreen;
