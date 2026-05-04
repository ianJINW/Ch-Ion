export interface SendMessageData {
  roomId?: string;
  msg: string;
}

export interface RoomMessage {
  msg: string;
  senderId: string;
  roomId: string;
}

export interface GlobalMessage {
  msg: string;
  senderId: string;
}
