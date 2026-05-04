import Message from "../models/message"

const createMessage = async (roomId: string, msg: string, userId: string) => {
  const message = await Message.create({ roomId, msg, senderId: userId })

  return message
}

const getMessages = async (roomId: string) => {
  return Message.find({ roomId }).sort({ createdAt: 1 })
}

export default { createMessage, getMessages }