import { Types } from "mongoose";
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "./logger.js";
import envConfig from "../config/env.Config.js";
import socketAuth from '../middleware/auth.js';
import Room from "../models/room.js";
import Message from "../models/message.js";
const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: envConfig.FRONTEND_URL,
            credentials: true,
            methods: ["GET", "POST"],
        }
    });
    io.use(socketAuth);
    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.id}`);
        if (!socket.data.user) {
            socket.disconnect();
            return;
        }
        socket.username = socket.data.user.username;
        socket.userId = socket.data.user.id;
        socket.on("join_room", async (roomId) => {
            try {
                // Create room in DB if it doesn't exist
                let room = await Room.findOne({ name: roomId });
                if (!room) {
                    room = await Room.create({
                        name: roomId,
                        createdBy: socket.userId,
                        members: [new Types.ObjectId(socket.userId)]
                    });
                }
                const isMember = room.members.some(member => member.toString() === socket.userId);
                if (!isMember) {
                    room.members.push(new Types.ObjectId(socket.userId));
                    await room.save();
                }
                socket.join(roomId);
                // Send message history
                const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
                socket.emit('messages', messages);
                logger.info(`👥 ${socket.id} joined room: ${roomId}`);
            }
            catch (error) {
                logger.error(error);
                socket.emit("error_message", "Failed to join room");
            }
        });
        socket.on("leave_room", (roomId) => {
            socket.leave(roomId);
            logger.info(`🚪 ${socket.id} left room: ${roomId}`);
        });
        socket.on("send_message", async ({ roomId, msg, global }) => {
            try {
                if (!msg || typeof msg !== "string" || !msg.trim())
                    return;
                if (msg.length > 1000) {
                    return;
                }
                if (global) {
                    const message = await Message.create({
                        roomId: envConfig.GLOBAL_ROOM,
                        msg,
                        senderId: socket.userId
                    });
                    io.emit("global_message", message);
                }
                if (!roomId) {
                    socket.emit("error_message", "Room ID required!");
                    return;
                }
                if (!Types.ObjectId.isValid(roomId)) {
                    socket.emit("error_message", "Room ID is invalid!");
                    return;
                }
                const room = await Room.findById(roomId);
                if (!room) {
                    socket.emit("error_message", "Room not found!!");
                    return;
                }
                const isMember = room.members.some((member) => member.toString() === socket.data.user.id);
                if (!isMember) {
                    socket.emit("error_message", "Access denied");
                    return;
                }
                const message = await Message.create({
                    roomId,
                    msg,
                    senderId: socket.userId
                });
                io.to(roomId).emit("room_message", message);
                return;
            }
            catch (err) {
                logger.error(err);
                socket.emit("error_message", "Failed to send message");
            }
        });
        socket.on("disconnect", () => {
            logger.warn(`User disconnected: ${socket.id}`);
        });
    });
};
export default initSocket;
//# sourceMappingURL=socket.js.map