import type { NextFunction, Request, Response } from 'express';
import User from '../models/user.js';
import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';
import { parse } from 'cookie';

const socketAuth = async (socket: any, next: (err?: Error) => void) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error('No authentication credentials provided. Please log in.'));
    }

    const cookies = parse(cookieHeader);
    const token = cookies.tokencookie;

    if (!token) {
      return next(new Error('Missing authentication token. Please log in.'));
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new Error('User not found. Please log in again.'));
    }

    socket.data.user = user;

    logger.info(`Socket authenticated: ${user.username} (${socket.id})`);

    next();
  } catch (error) {
    logger.warn('Socket authentication failed:', error instanceof Error ? error.message : 'Unknown error');
    next(new Error('Authentication failed. Invalid or expired token.'));
  }
};

export default socketAuth;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.tokencookie

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required. Please log in.'
      });
    }

    const decoded = verifyToken(token) as { userId: string };

    req.user = { id: decoded.userId };
    logger.info(`Request authorized for user: ${decoded.userId}`)
    next();
  } catch (error) {
    logger.warn('Authentication failed:', error instanceof Error ? error.message : 'Unknown error');

    return res.status(401).json({
      message: 'Invalid or expired token. Please log in again.'
    });
  }
}
