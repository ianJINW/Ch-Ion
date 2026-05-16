import { Router } from "express";
import { createMessage, getMessages } from "../controller/message.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const messageRouter = Router();
messageRouter.route('/').post(authMiddleware, createMessage).get(authMiddleware, getMessages);
export default messageRouter;
//# sourceMappingURL=message.route.js.map