import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";
// Load .env for local development
config();
// Provide sane defaults for local development so the server doesn't
// crash when env vars are missing. In production, set these explicitly.
const envConfig = cleanEnv(process.env, {
    PORT: port({ default: 8000 }),
    FRONTEND_URL: str({ default: process.env.FRONTEND_URL ?? 'http://localhost:5173' }),
    MONGO_URI: str({ default: process.env.MONGO_URI ?? 'mongodb://localhost:27017/ch-ion' }),
    JWT_SECRET: str({ default: process.env.JWT_SECRET ?? 'dev_jwt_secret' }),
    GLOBAL_ROOM: str({ default: process.env.GLOBAL_ROOM ?? 'global' }),
    PEPPER_SECRET: str({ default: process.env.PEPPER_SECRET ?? 'dev_pepper' })
});
export default envConfig;
//# sourceMappingURL=env.Config.js.map