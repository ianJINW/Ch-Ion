import express from "express"
import { createServer } from "http";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import logger from "./src/utils/logger.js"
import envConfig from "./src/config/env.Config.js";
import reqLogger from "./src/middleware/logging.js";
import initSocket from "./src/utils/socket.js";
import connectDB from "./src/config/db.js";
import userRouter from "./src/routes/user.route.js";
import messageRouter from "./src/routes/message.route.js";
import roomRouter from './src/routes/room.routes';


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

app.use('/api', userRouter)
app.use('/api/messages', messageRouter)
app.use('/api/rooms', roomRouter)

server.listen(envConfig.PORT, () => {
  logger.info(`Server running on http://localhost:${envConfig.PORT}`);
}) 
