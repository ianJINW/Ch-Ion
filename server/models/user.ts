import { Document, model, Schema } from 'mongoose';
import { compare, genSalt, hash } from "bcryptjs";

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
}
)

userSchema.pre('save', async function () {
  if (!this.isModified("password")) return

  const salt = await genSalt(10)

  this.password = await hash(this.password!, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return compare(candidatePassword, this.password)
}

userSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});
const User = model<IUser>("User", userSchema)

export default User