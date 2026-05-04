import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

const reqLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start

    logger.info("HTTP Request", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
    })
  })

  next()
}

export default reqLogger