import { connect } from "mongoose";
import logger from "../utils/logger.js";
import {} from 'mongoose';
const connectDB = async (uri) => {
    try {
        await connect(uri);
        logger.info(`🟢 MongoDB connected`);
    }
    catch (error) {
        logger.error(`🔴 MongoDB connection failed ${error}`);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map