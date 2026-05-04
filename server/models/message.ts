import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  roomId: { type: String, unique: true, required: true },
  senderId: { type: String, required: true },
  msg: { type: String, required: true }
},
  { timestamps: true }
)

const Message = model("Message", messageSchema)

export default Message