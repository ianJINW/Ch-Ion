import { Document, model, Schema, type HydratedDocument } from 'mongoose';
import { compare, genSalt, hash } from "bcryptjs";
import { createHmac } from 'crypto';
import envConfig from '../config/env.Config.js';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
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
})

const pepperPassword = (password: string) => {
  return createHmac('sha256', envConfig.PEPPER_SECRET).update(password).digest('hex')

}

userSchema.pre('save', async function (this: HydratedDocument<IUser>) {
  if (!this.isModified("password")) return

  const peppered = pepperPassword(this.password!)
  const salt = await genSalt(10)
  this.password = await hash(peppered, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;

  return compare(pepperPassword(candidatePassword), this.password)
}

userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = model<IUser>("User", userSchema)

export default User