import express from "express"
import { createUser, deleteUser, updateUser } from "../controllers/user.controllers.js"

const router = express.Router()


router.post("/createUser", createUser)

router.put("/updateUser/:id", updateUser)

router.delete("/deleteUser/:id", deleteUser)

export default router