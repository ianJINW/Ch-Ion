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
            logger.warn(`Socket ${socket.id} disconnected: no user data`);
            socket.disconnect();
            return;
        }
        socket.username = socket.data.user.username;
        socket.userId = socket.data.user.id;
        socket.on("error", (error) => {
            logger.error(`Socket error for ${socket.id}:`, error);
        });
        socket.on("join_room", async (roomId) => {
            try {
                if (!roomId || typeof roomId !== 'string') {
                    socket.emit("error_message", "Invalid room ID");
                    return;
                }
                let room = await Room.findOne({ name: roomId });
                if (!room) {
                    room = await Room.create({
                        name: roomId,
                        createdBy: socket.userId,
                        members: [new Types.ObjectId(socket.userId)]
                    });
                    logger.info(`Room created: ${roomId} by ${socket.username}`);
                }
                const isMember = room.members.some(member => member.toString() === socket.userId);
                if (!isMember) {
                    room.members.push(new Types.ObjectId(socket.userId));
                    await room.save();
                }
                socket.join(roomId);
                const messages = await Message.find({ roomId })
                    .populate("senderId", "username -password")
                    .sort({ createdAt: 1 });
                socket.emit('messages', messages);
                logger.info(`${socket.username} joined room: ${roomId}`);
            }
            catch (error) {
                logger.error("Failed to join room:", error);
                socket.emit("error_message", "Failed to join room");
            }
        });
        socket.on("leave_room", (roomId) => {
            try {
                socket.leave(roomId);
                logger.info(`${socket.username} left room: ${roomId}`);
            }
            catch (error) {
                logger.error("Failed to leave room:", error);
            }
        });
        socket.on("send_message", async ({ roomId, msg, global }) => {
            try {
                if (!msg || typeof msg !== "string" || !msg.trim()) {
                    socket.emit("error_message", "Message cannot be empty");
                    return;
                }
                if (msg.length > 1000) {
                    socket.emit("error_message", "Message is too long (max 1000 characters)");
                    return;
                }
                if (global) {
                    const message = await Message.create({
                        roomId: envConfig.GLOBAL_ROOM,
                        msg: msg.trim(),
                        senderId: socket.userId
                    });
                    io.emit("global_message", message);
                    logger.debug(`Global message from ${socket.username}: ${msg.substring(0, 50)}...`);
                    return;
                }
                if (!roomId) {
                    socket.emit("error_message", "Room ID is required");
                    return;
                }
                if (!Types.ObjectId.isValid(roomId)) {
                    socket.emit("error_message", "Invalid room ID format");
                    return;
                }
                const room = await Room.findById(roomId);
                if (!room) {
                    socket.emit("error_message", "Room not found");
                    return;
                }
                const isMember = room.members.some((member) => member.toString() === socket.userId);
                if (!isMember) {
                    socket.emit("error_message", "You are not a member of this room");
                    return;
                }
                const message = await Message.create({
                    roomId,
                    msg: msg.trim(),
                    senderId: socket.userId
                });
                // Populate user info before sending
                await message.populate("senderId", "username -password");
                io.to(roomId).emit("room_message", message);
                logger.debug(`Message sent to room ${roomId} by ${socket.username}`);
            }
            catch (err) {
                logger.error("Failed to send message:", err);
                socket.emit("error_message", "Failed to send message. Please try again.");
            }
        });
        socket.on("disconnect", () => {
            logger.info(`User disconnected: ${socket.username} (${socket.id})`);
        });
    });
};
export default initSocket;
//# sourceMappingURL=socket.js.map