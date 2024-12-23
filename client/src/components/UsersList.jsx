import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setOtherUsers,
  setSelectedChatUser,
} from "../redux/features/User/UserSlice";
import { useSocket } from "../context/SocketContext";

function UsersList({onUserClick}) {
  const selectedChatUser = useSelector((state) => state.User?.selectedChatUser)
  const [otherUsers, setLocalOtherUsers] = useState(null); // State to store users locally
  const [searchValue, setSearchValue] = useState(""); // State for search input
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [selectedChat, setSelectedChat] = useState(null); // State for selected chat

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
          "http://localhost:5000/api/authRoutes/getOtherUsers",
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
      {/* Search Bar */}
      <div className="p-4 border-b border-base-300 ">
        <div className="form-control">
          <div className="flex gap-4 ">
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

      {/* Users List */}
      <div className="overflow-y-auto flex-1">
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
              {/* User Avatar */}
              <div className={`avatar ${isOnline ? "online" : ""}`}>
                <div className="w-12 rounded-full">
                  <img src={user.profilePic} alt={user.userName} />
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <h3 className="font-medium">{user.userName}</h3>
                {/* <p className="text-sm text-base-content/70">
                  {user.email || "No email provided"}
                </p> */}
              </div>

              {/* User Additional Info */}
              <div className="text-xs text-base-content/70">
                <p>{`Age: ${user.age || "N/A"}`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default UsersList;
