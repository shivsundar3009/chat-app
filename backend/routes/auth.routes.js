import express from "express"
import { getOtherUsers, loginUser , logoutUser } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/loginUser", loginUser)

router.post("/logoutUser", logoutUser)


router.post("/getOtherUsers", authMiddleware ,  getOtherUsers)

export default router