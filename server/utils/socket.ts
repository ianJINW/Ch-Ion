import { Server } from "socket.io"
import logger from "./logger"
import envConfig from "../config/env.Config"
import socketAuth from '../middleware/auth';


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

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId)

      logger.info(`👥 ${socket.id} joined room: ${roomId}`)
    })

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId)

      logger.info(`🚪 ${socket.id} left room: ${roomId}`)
    })

    socket.on("send_message", ({ roomId, msg, global }) => {
      if (roomId) {
        io.to(roomId).emit("room_message", {
          msg, senderId: socket.id, roomId
        })

        logger.info(`Room message from ${socket.id}: ${msg}`)
        return
      }

      if (global) {
        io.emit("global_message", { msg, senderId: socket.id })

        logger.info(`Global message from ${socket.id}: ${msg}`);
      }
    })

    socket.on("disconnect", () => {
      logger.warn(`User disconnected: ${socket.id}`)
    })
  })
}

export default initSocket