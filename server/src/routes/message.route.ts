import { Router } from "express"

import { createMessage, getMessages } from "../controller/message.controller.js"
import { authMiddleware } from "../middleware/auth.js"

const messageRouter = Router()

messageRouter.route('/').all(authMiddleware).post(createMessage).get(getMessages)

export default messageRouter