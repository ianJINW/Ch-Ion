import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import socket from '../utils/socket';

type Message = {
  _id: string
  msg: string
  senderId: string
  roomId: string
  createdAt: string
}

const useSocket = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [connected, setConnected] = useState(false)
  const [room, setRoom] = useState<string | null>(null)

  useEffect(() => {
    const onConnect = () => {
      setConnected(true)

      toast.success(`Connected to chat server`)
    }

    const onHistory = (msgs: Message[]) => {
      setMessages(msgs)
    }

    const onDisconnect = () => {
      setConnected(false)

      toast.error(`Disconnected from server`)
    }

    const onMessage = (msg: Message) => {
      setMessages(prev => [...prev, msg])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('room_message', onMessage)
    socket.on('global_message', onMessage)
    socket.on('messages', onHistory)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('room_message', onMessage)
      socket.off('global_message', onMessage)
      socket.off('messages', onHistory)

    }

  }, [])

  const sendMessage = (msg: string) => {
    if (!msg.trim()) {
      toast.error(`Messsage cannot be empty`)
      return
    }

    if (room) {
      socket.emit("send_message", { msg, roomId: room })
    }
    else {
      socket.emit("send_message", { global: true, msg })
    }

/*     toast.success(`Message sent successfully`)
 */  }

  const joinRoom = (roomId: string) => {
    if (room) {
      socket.emit("leave_room", room)
    }

    setRoom(roomId)
    socket.emit("join_room", roomId)
  }

  const joinGlobal = () => {
    setMessages([])
    setRoom(null)
  }

  const leaveRoom = () => {
    if (!room) return

    socket.emit("leave_room", room)
    setRoom(null)
    setMessages([])
  }

  return {
    socket, messages, connected, sendMessage, room, joinRoom, joinGlobal, leaveRoom
  }
}

export default useSocket