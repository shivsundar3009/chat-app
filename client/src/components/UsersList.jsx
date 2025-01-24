import React, { useState, useEffect } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setOtherUsers,
  setSelectedChatUser,
} from "../redux/features/User/UserSlice";
import { useSocket } from "../context/SocketContext";
import { backendUrl } from "../utils/allUrls";

function UsersList({onUserClick , searchValue}) {
  const selectedChatUser = useSelector((state) => state.User?.selectedChatUser)
  const [otherUsers, setLocalOtherUsers] = useState(null); // State to store users locally
  
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [selectedChat, setSelectedChat] = useState(null); // State for selected chat

  const getUsersUrl = `${backendUrl}/api/authRoutes/getOtherUsers`

  useEffect(()=> {

    if(!selectedChatUser) {
      setSelectedChat(null)
    }

  },[selectedChatUser])

  const { onlineUsers } = useSocket();
  // console.log(onlineUsers);

  const dispatch = useDispatch();

  const handleClickOnUser = (user) => {
    onUserClick();
    setSelectedChat(user);
    dispatch(setSelectedChatUser(user));
  };

  // Fetch other users on component mount
  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const response = await axios.post(
          getUsersUrl,
          {},
          { withCredentials: true }
        );
        const users = response.data; // Get users from the response
        setLocalOtherUsers(users); // Update local state
        dispatch(setOtherUsers(users)); // Update Redux store
        setFilteredUsers(users); // Initialize filtered users
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    fetchOtherUsers();
  }, [dispatch]);

  // Filter users based on search input
  useEffect(() => {
    if (otherUsers) {
      const filtered = otherUsers.filter((user) =>
        user.userName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchValue, otherUsers]);

  if (!filteredUsers) {
    return <p>Loading users...</p>;
  }

  return (
    <>
      

      {/* Users List */}
      <div className="h-[568px] overflow-y-auto">
        {filteredUsers.map((user) => {
          let isOnline = false; // Default to false

          // Ensure onlineUsers is an array and check if the user is online
           if(onlineUsers) {
             isOnline = onlineUsers.includes(user._id);

             
 
           }

          return (
            <div
              key={user._id}
              onClick={() => handleClickOnUser(user)}
              className={`flex items-center gap-4 p-4 hover:bg-base-200 cursor-pointer border-b border-base-200 ${
                selectedChat?._id === user._id ? "bg-base-200" : ""
              }`}
            >

              <div className={`avatar ${isOnline ? "online" : ""}`}>
                <div className="w-12 rounded-full">
                  <img src={user.profilePic} alt={user.userName} />
                </div>
              </div>

              
              <div className="">
                <h3 className="font-medium">{user.userName}</h3>
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
}

export default UsersList;
