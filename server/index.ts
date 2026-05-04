import express from "express"
import { createServer } from "http"
import logger from "./utils/logger"
import cors from 'cors'; 
import envConfig from "./config/env.Config";
import reqLogger from "./middleware/logging";
import initSocket from "./utils/socket";
import connectDB from "./config/db";
import router from "./routes/user.route";

const app = express()

app.use(cors({ 
  origin: envConfig.FRONTEND_URL,
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(reqLogger)
const server = createServer(app)

initSocket(server)
connectDB(envConfig.MONGO_URI)

app.use('/api', router)

server.listen(envConfig.PORT, () => {
  logger.info(`Server running on http://localhost:${envConfig.PORT}`);
}) 