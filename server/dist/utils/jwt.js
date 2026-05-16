import jwt from "jsonwebtoken";
import envConfig from "../config/env.Config.js";
const SECRET = envConfig.JWT_SECRET;
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
export const signToken = (userId) => {
    return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
};
//# sourceMappingURL=jwt.js.map