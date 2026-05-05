import User from '../models/user';
import { verifyToken } from '../utils/jwt';

const socketAuth = async (socket: any, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('No token'));

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId)

    if (!user) return next(new Error("User not found"));
    console.log(user);

    socket.data.user = user;
    next();
  } catch (error) {
    next(new Error('Unauthorized'));
  }
};

export default socketAuth;   