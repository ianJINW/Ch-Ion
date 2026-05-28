import { Document, model, Schema } from 'mongoose';
import { compare, genSalt, hash } from "bcryptjs";
import { createHmac } from 'crypto';
import envConfig from '../config/env.Config.js';
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const pepperPassword = (password) => {
    return createHmac('sha256', envConfig.PEPPER_SECRET).update(password).digest('hex');
};
userSchema.pre('save', async function () {
    if (!this.isModified("password"))
        return;
    const peppered = pepperPassword(this.password);
    const salt = await genSalt(10);
    this.password = await hash(peppered, salt);
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return compare(pepperPassword(candidatePassword), this.password);
};
userSchema.set("toJSON", {
    transform: (_, ret) => {
        delete ret.password;
        return ret;
    },
});
const User = model("User", userSchema);
export default User;
//# sourceMappingURL=user.js.map