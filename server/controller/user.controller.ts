import { Request, Response } from "express";
import User from "../models/user";
import logger from '../utils/logger';
import { signToken } from "../utils/jwt"


const handleControllerError = (res: Response, error: any, defaultMessage: string) => {
  logger.error(error.message);
  return res.status(500).json({ msg: defaultMessage });
};

export const createUser = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ msg: 'Request body must be sent as JSON' });
  }

  const { username, email, password } = body as { username?: string; email?: string; password?: string };
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'username, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ msg: "Username already exists" });
    }

    const user = await User.create({ username, email, password });
    logger.info(`User ${username} created successfully`);

    return res.status(201).json({
      msg: "User created successfully!",
      user: { id: user._id, username, email }
    });
  } catch (error) {
    return handleControllerError(res, error, "User not created");
  }
};

export const login = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ msg: 'Request body must be sent as JSON' });
  }

  const { email, password } = body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ msg: 'email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = signToken(user.id);

    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    return handleControllerError(res, error, "Login failed");
  }
};   
