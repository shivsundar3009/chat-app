import { User } from "../models/user.model.js"
import bcrypt from "bcrypt"

// create User 

export const createUser = async (req, res) => {
    try {
        const { userName, email, number, password, age, gender } = req.body;

        // Check if username already exists
        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check if number already exists
        const existingNumber = await User.findOne({ number });
        if (existingNumber) {
            return res.status(400).json({ message: "Number already exists" });
        }

        // Select profile picture based on gender
        const boysProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlsProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        const profilePic = (gender === "male") ? boysProfilePic : girlsProfilePic;

        // Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = await User.create({
            userName,
            email,
            number,
            password: hashedPassword, // Use the hashed password
            age,
            gender,
            profilePic
        });

        // Send a success response
        return res.status(201).json({ message: "User created successfully", newUser });

    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: "User creation failed", error: error.message });
    }
};


// update User

export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Extract the `updates` object from req.body
      const { updates }  = req.body;
  
      // Ensure updates object exists before proceeding
      if (!updates) {
        return res.status(400).json({ message: "No updates provided" });
      }
  
      // Check if the user exists
      const existingUser = await User.findById(id);
  
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Proceed to update the user
      const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
  
      // Return success message and updated user details
      res.status(200).json({ message: "User updated successfully", updatedUser });
  
    } catch (error) {
      console.log("Error in updating user:", error.message);
      res.status(500).json({ message: "Error in updating user", error: error.message });
    }
  };


// delete User

export const deleteUser = async (req , res) => {

    try {

        const {id} = req.params

        await User.findByIdAndDelete(id)

        res.status(200).json({message:"user deleted successfully"})
        
    } catch (error) {
        
        console.log("error in deleting user", error.message)

        res.status(400).json({message:"error in deleting user" , error:error.message})
    }

}