import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import ChatBox from './ChatBox';
import UsersList from './UsersList';
import { useSocket } from '../context/SocketContext';

const HomeScreen = () => {
  const currentUser = useSelector((state) => state.User?.loggedInUser);
  const onlineUsers = useSocket();
  
  // State to control panel visibility
  const [isUserSelected, setIsUserSelected] = useState(false);

  const [removeCssForBack, setRemoveCssForBack] = useState(null);

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
      <div className={`w-full md:w-1/3 border-r border-base-300 bg-base-100 flex flex-col ${isUserSelected ? "hidden" : ""} md:block` }>
        {/* Header with user profile and logout button */}
        <div className="p-4 border-b border-base-300 bg-green-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`avatar`}>
              <div className="w-10 rounded-full">
                <img src={currentUser?.profilePic || 'default-avatar-url'} alt="Profile" />
              </div>
            </div>
            <h2 className="font-semibold">{currentUser?.userName}</h2>
          </div>
          <LogoutButton />
        </div>
        {/* User List */}
        <UsersList onUserClick={handleUserClick} />
      </div>

      {/* Right Panel - ChatBox (Visible only on larger screens or when a user is clicked) */}
      <div className={` ${isUserSelected ? "block" : "hidden"} md:flex flex-1 flex-col bg-base-100 `}>
        <ChatBox back={handleBackHome}/>
      </div>
    </div>
  );
};

export default HomeScreen;
