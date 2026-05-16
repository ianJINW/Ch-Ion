import jwt from "jsonwebtoken";
import envConfig from "../config/env.Config.js";

const SECRET = envConfig.JWT_SECRET

interface JwtPayload {
  userId: string;
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1h' })
}
