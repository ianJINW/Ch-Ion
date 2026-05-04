import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";

config();

const envConfig = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  FRONTEND_URL: str(),
  MONGO_URI: str(),
  JWT_SECRET:str()
});

export default envConfig;