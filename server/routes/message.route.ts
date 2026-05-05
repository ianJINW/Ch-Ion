import { Router } from "express"

import { createMessage, getMessages } from "../controller/message.controller"

const messageRouter = Router()

messageRouter.route('/').post(createMessage).get(getMessages)

export default messageRouter