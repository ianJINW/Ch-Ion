import { type Request, type Response } from "express";
import User from "../models/user.js";
import logger from '../utils/logger.js';
import { signToken } from "../utils/jwt.js"

const handleControllerError = (
  res: Response,
  error: unknown,
  defaultMessage: string
) => {
  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error('Unknown error');
  }

  return res.status(500).json({
    message: defaultMessage
  });
};

export const createUser = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ message: 'Request body must be sent as JSON' });
  }

  const { username, email, password } = body as { username?: string; email?: string; password?: string };
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists"
      });
    }

    const user = await User.create({ username, email, password });
    logger.info(`User ${username} created successfully`);

    return res.status(201).json({
      message: "User created successfully!",
      user: { id: user._id, username, email }
    });
  } catch (error) {
    return handleControllerError(res, error, "User not created");
  }
};

export const login = async (req: Request, res: Response) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ message: 'Request body must be sent as JSON' });
  }

  const { email, password } = body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = signToken(user.id.toString());

    res.cookie("tokencookie", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60
    })
    
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return handleControllerError(res, error, "Login failed");
  }
};

export const me = async (req: Request, res: Response) => {
  const user = req.user

  res.json({ user, message: "Hit just right" })
}

export const logOut = async (req: Request, res: Response) => {
  req.user = { id: "" }
  res.clearCookie("tokencookie", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:"/"
  });

  res.json({ message: "LOgged out" })
}
