import { create } from "zustand";
import { persist } from "zustand/middleware";
import socket from "../utils/socket";
import { toast } from "sonner";

export interface Message {
  _id: string;
  msg: string;
  senderId: string;
  roomId: string;
  createdAt: string;
}

interface ChatStore {
  connected: boolean;
  room: string | null;
  messages: Message[];

  connect: () => void;
  disconnect: () => void;

  joinRoom: (roomId: string) => void;
  joinGlobal: () => void;
  leaveRoom: () => void;

  sendMessage: (msg: string) => void;
}

let initialized = false;

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      connected: false,
      room: null,
      messages: [],

      connect: () => {
        if (initialized) return;

        initialized = true;

        if (!socket.connected) {
          socket.connect();
        }

        socket.on("connect", () => {
          set({ connected: true });

          toast.success("Connected to chat server");
        });

        socket.on("disconnect", () => {
          set({ connected: false });

          toast.error("Disconnected from server");
        });

        socket.on("messages", (msgs: Message[]) => {
          set({
            messages: msgs,
          });
        });

        socket.on("room_message", (msg: Message) => {
          set((state) => ({
            messages: [...state.messages, msg],
          }));
        });

        socket.on("global_message", (msg: Message) => {
          set((state) => ({
            messages: [...state.messages, msg],
          }));
        });
      },

      disconnect: () => {
        socket.disconnect();
      },

      joinRoom: (roomId) => {
        const currentRoom = get().room;

        if (currentRoom) {
          socket.emit("leave_room", currentRoom);
        }

        set({
          room: roomId,
          messages: [],
        });

        socket.emit("join_room", roomId);
      },

      joinGlobal: () => {
        const currentRoom = get().room;

        if (currentRoom) {
          socket.emit("leave_room", currentRoom);
        }

        set({
          room: null,
          messages: [],
        });
      },

      leaveRoom: () => {
        const currentRoom = get().room;

        if (!currentRoom) return;

        socket.emit("leave_room", currentRoom);

        set({
          room: null,
          messages: [],
        });
      },

      sendMessage: (msg) => {
        if (!msg.trim()) {
          toast.error("Message cannot be empty!");
          return;
        }

        const room = get().room;

        if (room) {
          socket.emit("send_message", {
            msg,
            roomId: room,
          });
        } else {
          socket.emit("send_message", {
            global: true,
            msg,
          });
        }
      },
    }),
    {
      name: "chat-storage",

      partialize: (state) => ({
        room: state.room,
      }),
    }
  )
);

export default useChatStore;