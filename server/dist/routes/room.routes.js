import { Router } from "express";
import { createRoom, getRooms } from "../controller/room.controller.js";
import { authMiddleware } from "../middleware/auth.js";
const roomRouter = Router();
roomRouter.route("/").all(authMiddleware).get(getRooms).post(createRoom);
export default roomRouter;
//# sourceMappingURL=room.routes.js.map