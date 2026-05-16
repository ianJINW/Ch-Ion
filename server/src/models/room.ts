import { Schema, model, Types } from "mongoose";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    members: [
      {
        type: Types.ObjectId,
        ref: "User"
      }
    ],

    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Room = model("Room", roomSchema);

export default Room;