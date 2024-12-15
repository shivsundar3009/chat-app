import express from "express"
import { sendMessage , getMessages } from "../controllers/conversation.controllers.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post('/sendMessage/:_id',authMiddleware ,sendMessage)

router.post('/getMessages/:_id',authMiddleware ,getMessages)

export default router