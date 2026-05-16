import { Router } from "express";
import { createUser, login, me } from "../controller/user.controller.js";

const userRouter = Router()

userRouter.route('/').post(createUser)
userRouter.route('/me').post(me)

userRouter.route('/login').post(login)

export default userRouter 