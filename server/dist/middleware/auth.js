import User from '../models/user.js';
import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';
import { parse } from 'cookie';
const socketAuth = async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            return next(new Error('No cookies provided'));
        }
        const cookies = parse(cookieHeader);
        const token = cookies.tokencookie;
        if (!token) {
            return next(new Error('Unauthorized'));
        }
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return next(new Error('User not found'));
        }
        socket.data.user = user;
        logger.info(`Socket connected: ${user.username}`);
        next();
    }
    catch (error) {
        logger.error(error);
        next(new Error('Unauthorized'));
    }
};
export default socketAuth;
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.tokencookie;
        if (!token)
            return res.status(401).json({
                msg: "Not authenticated!"
            });
        const decoded = verifyToken(token);
        req.user = { id: decoded.userId };
        logger.info(`Welcome authorized member`);
        next();
    }
    catch (error) {
        logger.error('Not authorized');
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
//# sourceMappingURL=auth.js.map