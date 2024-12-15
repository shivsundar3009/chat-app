import React from "react";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/features/User/UserSlice"; // Adjust the path based on your file structure

import { useSocket } from "../context/SocketContext";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { socket } = useSocket(); // Access the socket context

  const handleLogout = async () => {
    try {
      // Call API for logout
      const res = await axios.post("https://chat-app-ee8e.onrender.com/api/authRoutes/logoutUser",{},{
        withCredentials:true
      });

      console.log(res);
      
      // Dispatch Redux action to clear user state
      dispatch(logout());

      // Close the socket connection

      socket.disconnect(); // Close the socket connection



      // Navigate to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <button className="btn btn-outline" onClick={handleLogout}>
      <LogOut className="mr-2" /> Logout
    </button>
  );
};

export default LogoutButton;
