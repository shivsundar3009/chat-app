import mongoose from "mongoose";

import { configDotenv } from "dotenv";

configDotenv()

export default async () => {

    try {

        await mongoose.connect(process.env.MONGODB_URI)

        console.log('mongoDB connected ...')
        
    } catch (error) {

        console.log("error in mongoDB connection", error);
        
    }
}