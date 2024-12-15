import {User } from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const loginUser = async (req, res) => {
    try {
      const { identifier, password } = req.body;
  
      // Check if both identifier and password are provided
      if (!identifier || !password) {
        return res.status(400).json({
          message: "Username/email and password are required",
          success: false,
        });
      }
  
      // Find the user by either username or email
      const user = await User.findOne({
        $or: [{ userName: identifier }, { email: identifier }],
      });
  
      // Check if user was found
      if (!user) {
        return res.status(401).json({
          message: "User not found",
          success: false,
        });
      }
  
      // Compare passwords
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Incorrect password",
          success: false,
        });
      }
  
      // Create JWT payload and token
      const payload = { _id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
  
      // Set the token as a cookie and return success response
      res
        .status(200)
        .cookie("token", token, {
          maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
          httpOnly: true,
        })
        .json({
          message: "User logged in successfully",
          user,
          success: true,
          token
        });
  
    } catch (error) {
      console.error("Error in login:", error);
      return res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };

export const getOtherUsers = async (req , res ) => {

       try {

        const loggedInUsedID = req._id

       const otherUsers = await User.find({_id : {$ne:loggedInUsedID}}).select("-password")
       
      //  console.log(otherUsers);

    res.json(otherUsers)

        
       } catch (error) {

        res.status(500).json({
          message: "Internal server error",
          success: false,
          error
      });
        
       }


}

export const logoutUser = async (req, res) => {

    try {

        res.status(200).cookie("token","",{maxAge:0}).json({
            message:"successfully logged out",
            success:true
        })
        
    } catch (error) {

        res.status(400).json({
            message:"user logout Failed",
            success:false
        })
        
    }

}