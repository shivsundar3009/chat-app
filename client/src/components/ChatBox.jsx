import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

function ChatBox() {
  const currentUser = useSelector((state) => state.User?.loggedInUser); // Logged-in user's details
  const selectedChatUser = useSelector((state) => state.User?.selectedChatUser); // Chat partner details
  const [conversation, setConversation] = useState([]); // Holds messages for the chat
  const [messageText, setMessageText] = useState(""); // Controlled input for the message
  const messagesEndRef = useRef(null); // Reference for the end of the messages container

  const {socket} = useSocket();
 
  // console.log("chatBox socket",socket);

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

        console.log(res.data);

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
  }, [selectedChatUser?._id, socket,setConversation,conversation]); // Only listen to the selected chat user and socket
  

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
      console.error(`Error sending message or fetching updated conversation:`, error);
    }
  };

  

  return (
    <div className="overflow-y-auto flex-1 flex flex-col bg-base-100">
      {selectedChatUser ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-base-300 flex items-center gap-4 bg-base-100">
            <div
              className={`avatar ${selectedChatUser.status === "online" ? "online" : "offline"}`}
            >
              <div className="w-10 rounded-full">
                <img src={selectedChatUser.profilePic} alt={selectedChatUser.userName} />
              </div>
            </div>
            <div>
              <h2 className="font-semibold">{selectedChatUser.userName}</h2>
              <p className="text-sm text-base-content/70">
                {selectedChatUser.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
            {conversation.length > 0 ? (
              conversation.map((message) => (
                <div
                  key={message._id}
                  className={`chat ${
                    message.sendersID === currentUser._id ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble ${
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
                  className={`btn ${messageText.trim() ? "btn-primary" : "btn-disabled"}`}
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
        <div className="flex flex-col items-center justify-center h-full text-center">
          <img
            src={currentUser?.profilePic}
            alt={`${currentUser?.userName}'s profile`}
            className="w-32 h-32 rounded-full mb-4 object-cover shadow-lg"
          />
          <h1 className="text-2xl font-bold mb-2">Welcome, {currentUser?.userName}!</h1>
          <p className="text-sm text-base-content/70">Select a chat to start a conversation</p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
