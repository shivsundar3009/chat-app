import mongoose from "mongoose";
import { User } from "./user.model.js";

const messageSchema = mongoose.Schema({
    sendersID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    recieversID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    message:{
        type: String,
        required:true
    }
},{
    timestamps:true
})

export const Message = mongoose.model("Message", messageSchema)