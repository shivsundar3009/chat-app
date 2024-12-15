import {Message} from "../models/message.model.js"
import {Conversation} from "../models/conversation.model.js"
import { getSocketId } from "../socket/socket.js";
import {io} from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    // Extract sender, receiver IDs and the message from the request
    const sendersID = req._id;
    const recieversID = req.params._id;
    const { message } = req.body;

    console.log(sendersID, recieversID, message);

    // Find existing conversation between the sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [sendersID, recieversID] },
    });

    console.log(conversation);

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sendersID, recieversID],
      });
    }

    // Create a new message and associate it with the sender and receiver
    const newMessage = await Message.create({
      sendersID,
      recieversID,
      message,
    });

    console.log("New message created with ID:", newMessage._id);

    // Add the new message to the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    const recieverSocketId = getSocketId(recieversID);

    const sendersSocketId = getSocketId(sendersID);

    console.log('recieverSOCKETIDD',recieverSocketId);

    if(!recieverSocketId && sendersSocketId) {

      io.to(sendersSocketId).emit('newMessage',newMessage)
    }

    if (recieverSocketId && sendersSocketId){
      console.log(`send message to ${recieverSocketId}`);
      // Emit a "newMessage" event to the receiver's socket
      io.to(recieverSocketId).emit('newMessage',newMessage);

      io.to(sendersSocketId).emit('newMessage', newMessage); 
    }

    // Send a success response with the conversation and message details
    return res.status(200).json({
      message: "Message sent successfully",
      conversation,
      newMessage, // Send the new message as part of the response
    });
  } catch (error) {
    console.error("Error sending message:", error.message);

    return res.status(400).json({
      message: "Error sending message",
      success: false,
      error: error.message,
    });
  }
};


export const getMessages = async (req , res) =>  {

     try {

         const sendersID = req._id

         const recieversID = req.params._id

         console.log(sendersID,recieversID);

         const conversation = await Conversation.findOne({
            participants: { $all : [sendersID,recieversID] }
         }).populate("messages")
           
         console.log(conversation);
          res.status(200).json({
            message:"successfull",
            conversation
          })
      
     } catch (error) {
        
       res.status(400).json({
         success:"failed",
         error:error.message
       })
     }

}