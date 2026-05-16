import { IUser } from "../../models/user"

declare global {
  namespace Express {
    interface Request {
      user?: { id: string }
    }
  }
}

export {}