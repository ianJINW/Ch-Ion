import { model, Schema } from "mongoose";

const roomSchema: Schema = new Schema({
  name: { type: String }
})

const Room = model("Room", roomSchema)

export default Room