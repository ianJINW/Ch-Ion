import { verifyToken } from '../utils/jwt';

const socketAuth = (socket: any, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('No token'));

    const decoded = verifyToken(token);
    socket.data.user = { id: decoded.userId };

    next();
  } catch (error) {
    next(new Error('Unauthorized'));
  }
};

export default socketAuth;   