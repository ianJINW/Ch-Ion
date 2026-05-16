import { type Request, type Response } from "express";
import logger from "../utils/logger.js";
import Room from "../models/room.js";

export const createRoom = async (req: Request, res: Response) => {
  const { name } = req.body

  try {
    if (!req.user) return res.status(401).json({ msg: `Unauthorized` })

    if (!name || typeof name !== "string") return res.status(400).json({ message: "Room name is required" })

    const existingRoom = await Room.findOne({ name })

    if (existingRoom) return res.status(400).json({ message: `Room already exists` })

    const room = await Room.create({
      name, createdBy: req.user!.id, members: [req.user!.id]
    })

    res.status(201).json({ room, message: `Room created successfully` })
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Failed to create room",
    });

  }
}

export const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    return res.json({
      rooms,
    });
  } catch (error) {
    logger.error(error);

    return res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
}
