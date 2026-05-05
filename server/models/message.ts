import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  roomId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Room"
  },
  senderId: {
    type: Schema.Types.ObjectId,
    required: true, ref: "User"
  },
  msg: { type: String, required: true }
},
  { timestamps: true }
)

messageSchema.index({ room: 1, createdAt: 1 })

const Message = model("Message", messageSchema)

export default Message