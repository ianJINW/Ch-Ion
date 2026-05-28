import { type Request, type Response } from "express"
import Message from "../models/message.js"
import { Types } from "mongoose";
import Room from "../models/room.js";
import logger from "../utils/logger.js";

export const createMessage = async (req: Request, res: Response) => {
  const { roomId, msg } = req.body
  try {

    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!roomId || !Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({
        message: "Invalid room ID",
      });
    }

    if (
      !msg ||
      typeof msg !== "string" ||
      msg.trim().length === 0
    ) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    if (msg.length > 1000) {
      return res.status(400).json({
        message: "Message too long",
      });
    }

    const room = await Room.findById(roomId)

    if (!room) return res.status(400).json({ message: "Room not found." })

    const isMember = room.members.some(member => member.toString() === req.user?.id)

    if (!isMember) return res.status(403).json({ message: "Access denied" })

    const message = await Message.create({ roomId, msg: msg.trim(), senderId: req.user?.id })

    res.status(201).json(message)
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Failed to create message",
    });
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    if (!req.query.roomId || typeof req.query.roomId !== 'string') {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const messages = await Message.find({ roomId: req.query.roomId })
      .populate("senderId", "username")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
}
