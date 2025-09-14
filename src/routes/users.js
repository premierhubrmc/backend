import express from "express"
import { addUser, fetchUsers, loginUser } from "../controllers/userController.js"


const userRoutes = express.Router()

userRoutes.post("/signup", addUser)

userRoutes.post("/login", loginUser)

userRoutes.get("/users", /*later we will add middleware so that only admins will fetch all users*/fetchUsers)

export default userRoutes