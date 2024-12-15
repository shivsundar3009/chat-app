import React, { useEffect, useState } from 'react';
import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LogoutButton from './LogoutButton';
import ChatBox from './ChatBox';
import UsersList from './UsersList';
import { logout } from '../redux/features/User/UserSlice'; // Import logout action
import TabCloseHandler from './TabCloseHandler';
import { useSocket } from '../context/SocketContext';

const HomeScreen = () => {

  const currentUser = useSelector((state) => state.User?.loggedInUser);

  const onlineUsers = useSocket()

  console.log(onlineUsers);
  


  return (
    <div className="flex h-screen bg-base-200">

<TabCloseHandler/>
      {/* Left Panel - Users List */}
      <div className="w-1/3 border-r border-base-300 bg-base-100 flex flex-col">
        {/* Header with user profile and logout button */}
        <div className="p-4 border-b border-base-300 bg-green-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`avatar  `}>
              <div className="w-10 rounded-full">
                {/* Optional chaining for profilePic */}
                <img src={currentUser?.profilePic || 'default-avatar-url'} alt="Profile" />
              </div>
            </div>
            {/* Optional chaining for userName */}
            <h2 className="font-semibold">{currentUser?.userName}</h2>
          </div>
        
          {/* Logout button */}
          <LogoutButton />
        </div>

        {/* User List */}
        <UsersList />
      </div>

      {/* Right Panel - Chat or Welcome Screen */}
      <div className="flex-1 flex flex-col bg-base-100">
        <ChatBox />
      </div>
    </div>
  );
};

export default HomeScreen;
