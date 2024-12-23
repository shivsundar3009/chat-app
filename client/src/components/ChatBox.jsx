import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import { setSelectedChatUser } from "../redux/features/User/UserSlice";

function ChatBox({ back }) {
  const currentUser = useSelector((state) => state.User?.loggedInUser); // Logged-in user's details
  const selectedChatUser = useSelector((state) => state.User?.selectedChatUser); // Chat partner details
  const [conversation, setConversation] = useState([]); // Holds messages for the chat
  const [messageText, setMessageText] = useState(""); // Controlled input for the message
  const messagesEndRef = useRef(null); // Reference for the end of the messages container
  const [isOnline, setIsOnline] = useState(false); // Track online status

  const dispatch = useDispatch();

  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    if (onlineUsers && selectedChatUser?._id) {
      setIsOnline(onlineUsers.includes(selectedChatUser._id));
    } else {
      setIsOnline(false); // Default to offline if no user is selected or `onlineUsers` is unavailable
    }
  }, [onlineUsers, selectedChatUser]);

  useEffect(() => {
    const getConversation = async () => {
      if (!selectedChatUser?._id) return; // Ensure a user is selected before fetching

      try {
        const res = await axios.post(
          `http://localhost:5000/api/conversation/getMessages/${selectedChatUser._id}`,
          {},
          {
            withCredentials: true, // Include cookies for authentication
          }
        );

        // console.log(res.data);

        // If the response contains no messages or null, reset the conversation
        if (!res?.data?.conversation?.messages) {
          setConversation([]); // Clear the conversation
        } else {
          setConversation(res.data.conversation.messages || []); // Set messages from the fetched conversation
        }
      } catch (error) {
        console.error(`Error fetching conversation:`, error);
      }
    };

    getConversation();
  }, [selectedChatUser]);

  // Scroll to the bottom of the messages container when conversation updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  useEffect(() => {
    // If a new message is received, add it to the conversation
    socket?.on("newMessage", (message) => {
      // Check if the message is coming from the selected chat user
      setConversation((prevMessages) => [...prevMessages, message]);
    });

    // Clean up socket listener on unmount or when socket changes
    return () => {
      socket?.off("newMessage");
    };
  }, [selectedChatUser?._id, socket, setConversation, conversation]); // Only listen to the selected chat user and socket

  const sendMessage = async () => {
    if (!messageText.trim()) return; // Avoid sending empty or whitespace messages

    try {
      // Send the message to the backend
      await axios.post(
        `http://localhost:5000/api/conversation/sendMessage/${selectedChatUser._id}`,
        { message: messageText.trim() },
        {
          withCredentials: true, // Include cookies for authentication
        }
      );
      setMessageText("");
    } catch (error) {
      console.log(
        `Error sending message or fetching updated conversation:`,
        error
      );
    }
  };

  const handleBackChat = () => {

    // console.log(`back back`);

    dispatch(setSelectedChatUser(null))

    setConversation([])

    back();
  };

  return (
    <div className="overflow-y-auto flex-1 h-full flex flex-col bg-base-100">
      {selectedChatUser ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-base-300 flex items-center justify-between gap-4 bg-base-100">
            {/* Avatar and User Info */}
            <div className="flex items-center gap-4">
              <div className={`avatar ${isOnline ? "online" : ""}`}>
                <div className="w-10 rounded-full">
                  <img
                    src={selectedChatUser.profilePic}
                    alt={selectedChatUser.userName}
                  />
                </div>
              </div>
              <div>
                <h2 className="font-semibold">{selectedChatUser.userName}</h2>
                <p className="text-sm text-base-content/70">
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Back Button for Small Screens */}
            <div className="md:hidden">
              <button
                onClick={handleBackChat} // or use your own function to handle back
                className="btn btn-ghost text-base-content"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
            {conversation.length > 0 ? (
              conversation.map((message) => (
                <div
                  key={message._id}
                  className={`chat ${
                    message.sendersID === currentUser._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble break-words ${
                      message.sendersID === currentUser._id
                        ? "chat-bubble-primary"
                        : "chat-bubble-secondary"
                    }`}
                  >
                    {message.message}
                  </div>
                  <div className="chat-footer text-xs text-base-content/70 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-center text-base-content/70 h-full">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            {/* Dummy div to act as a scroll target */}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-base-300 bg-base-100">
            <div className="form-control">
              <div className="input-group flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="input input-bordered flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />
                <button
                  className={`btn ${
                    messageText.trim() ? "btn-primary" : "btn-disabled"
                  }`}
                  disabled={!messageText.trim()}
                  onClick={sendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-between md:items-center md:justify-center h-full text-center">
          <img
            src={currentUser?.profilePic}
            alt={`${currentUser?.userName}'s profile`}
            className="w-32 h-32 rounded-full mb-4 object-cover shadow-lg"
          />
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {currentUser?.userName}!
          </h1>
          <p className="text-sm text-base-content/70">
            Select a chat to start a conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
