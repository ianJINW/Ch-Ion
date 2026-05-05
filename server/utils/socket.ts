import { Server } from "socket.io"
import logger from "./logger"
import envConfig from "../config/env.Config"
import socketAuth from '../middleware/auth';
import Room from "../models/room";
import Message from "../models/message";
import User from "../models/user";

declare module 'socket.io' {
  interface Socket {
    username: string;
  }
}

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: envConfig.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST"],
    }
  })

  io.use(socketAuth)

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`)

    socket.username = (socket as any).data.user.username

    socket.on("join_room", async (roomId: string) => {
      socket.join(roomId)

      // Create room in DB if it doesn't exist
      let room = await Room.findOne({ roomId });

      if (!room) {
        room = await Room.create({ roomId });
      }

      // Send message history
      const messages = await Message.find({ roomId });
      socket.emit('messages', messages)
      logger.info(`👥 ${socket.id} joined room: ${roomId}`)
    })

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId)

      logger.info(`🚪 ${socket.id} left room: ${roomId}`)
    })

    socket.on("send_message", async ({ roomId, msg, global }) => {
      if (roomId) {
        const message = new Message({ roomId, msg, senderId: socket.username })

        await message.save()

        io.to(roomId).emit("room_message", {
          msg, senderId: socket.username, roomId
        })

        logger.info(`Room message from ${socket.id}: ${msg}`)
        return
      }

      if (global) {
        io.emit("global_message", { msg, senderId: socket.username })

        logger.info(`Global message from ${socket.id}: ${msg}`);
      }
    })

    socket.on("disconnect", () => {
      logger.warn(`User disconnected: ${socket.id}`)
    })
  })
}

export default initSocket