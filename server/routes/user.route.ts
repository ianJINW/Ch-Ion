import { Router } from "express";
import { createUser, login } from "../controller/user.controller";

const router = Router()

router.route('/').post(createUser)

router.route('/login').post(login)

export default router 