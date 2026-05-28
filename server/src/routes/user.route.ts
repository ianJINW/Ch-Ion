import { Router } from "express";
import { createUser, login, me, logOut } from "../controller/user.controller.js";

const userRouter = Router()

userRouter.route('/').post(createUser)
userRouter.route('/me').get(me)
userRouter.route('/login').post(login)
userRouter.route('/logout').post(logOut)

export default userRouter 