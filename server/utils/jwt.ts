import envConfig from '../config/env.Config';
import { sign, verify } from "jsonwebtoken";

const SECRET = envConfig.JWT_SECRET

export const signToken = (userId: string) => {
  return sign({ userId }, SECRET, { expiresIn: '1h' })
}

export const verifyToken = (token: string) => {
  return verify(token, SECRET) as { userId: string }
}

