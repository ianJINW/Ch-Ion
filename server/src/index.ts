import express from "express"
import { createServer } from "http";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import logger from "./utils/logger.js"
import envConfig from "./config/env.Config.js";
import reqLogger from "./middleware/logging.js";
import initSocket from "./utils/socket.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import roomRouter from "./routes/room.routes.js";


const app = express()

app.use(cors({
  origin: envConfig.FRONTEND_URL,
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(reqLogger)

const server = createServer(app)

initSocket(server)
connectDB(envConfig.MONGO_URI)

// Routes
app.use('/api/user', userRouter)
app.use('/api/messages', messageRouter)
app.use('/api/rooms', roomRouter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Global error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = envConfig.PORT;

const instance = server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  instance.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  instance.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

