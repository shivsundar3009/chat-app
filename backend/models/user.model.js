import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    userName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },    
    number:{
        type:Number,
        required:true,
        unique:true,
    },    
    password:{
        type:String,
        required:true,
    },    
    age:{
        type:Number,
        required:true,
    }, 
    profilePic:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

export const User = mongoose.model('User',userSchema)