import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app ,server} from "./socket/socket.js"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

// Import your database connection
import connectDB from "./db/db.js";
connectDB();

const __dirname = path.resolve()

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL , credentials: true }));

// Routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

app.use("/api/userRoutes", userRoutes);
app.use("/api/authRoutes", authRoutes);
app.use("/api/conversation", conversationRoutes);

app.use(express.static(path.join(__dirname,"/client/dist")))
app.get('*', (req,res) => {
  res.sendFile(path.resolve(__dirname,'client', 'dist', 'index.html'))
})

// Default route
app.get("/", (req, res) => {
  res.send("Chat app server started");
});

// Simple endpoint to simulate the backend being alive
app.get('/api/heartbeat', (req, res) => {
  res.status(200).json({ message: "App is active" });
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
