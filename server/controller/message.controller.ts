import { NextFunction, Request, Response } from "express"
import Message from "../models/message"

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  const { roomId, msg, senderId } = req.body

  try {
    const message = await Message.create({ roomId, msg, senderId })

    res.status(201).json(message)
  } catch (error) {

  }
}

export const getMessages = async (roomId: string) => {
  return Message.find({ roomId }).sort({ createdAt: 1 })
}

