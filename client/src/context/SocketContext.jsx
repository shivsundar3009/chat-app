import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const socketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const authUser = useSelector((state) => state.User.loggedInUser);

  const [socket, setSocket] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState(null);

  // console.log(authUser);

  useEffect(() => {
    if (authUser) {
      // console.log(`hello ji`);

      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
          // console.log(users);
          setOnlineUsers(users);
      });

      return () => socket.disconnect();

    } else {
      console.log(`no authUser`);

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};

export function useSocket() {
  return useContext(socketContext);
}
