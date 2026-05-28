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
  error: string | null;

  connect: () => void;
  disconnect: () => void;

  joinRoom: (roomId: string) => void;
  joinGlobal: () => void;
  leaveRoom: () => void;

  sendMessage: (msg: string) => void;
  clearError: () => void;
}

let initialized = false;

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      connected: false,
      room: null,
      messages: [],
      error: null,

      connect: () => {
        if (initialized) return;

        initialized = true;

        if (!socket.connected) {
          socket.connect();
        }

        socket.on("connect", () => {
          set({ connected: true, error: null });

          const currentRoom = get().room;
          const shouldRestoreRoom = window.location.pathname.startsWith('/chat/');

          if (currentRoom && shouldRestoreRoom) {
            socket.emit('join_room', currentRoom);
          }
        });

        socket.on("disconnect", (reason: string) => {
          set({ connected: false });

          if (reason === 'io server disconnect') {
            toast.error("Disconnected by server. Please refresh and log in again.");
          } else {
            toast.error("Connection lost. Reconnecting...");
          }
        });

        socket.on("connect_error", (error: Error) => {
          set({ error: error.message || 'Connection error' });
          toast.error(`Connection error: ${error.message}`);
        });

        socket.on("error_message", (message: string) => {
          set({ error: message });
          toast.error(message);
        });

        socket.on("messages", (msgs: Message[]) => {
          set({ messages: msgs, error: null });
        });

        socket.on("room_message", (msg: Message) => {
          set((state) => ({
            messages: [...state.messages, msg],
            error: null
          }));
        });

        socket.on("global_message", (msg: Message) => {
          set((state) => ({
            messages: [...state.messages, msg],
            error: null
          }));
        });
      },

      disconnect: () => {
        socket.disconnect();
        set({ connected: false, error: null });
      },

      joinRoom: (roomId) => {
        const currentRoom = get().room;

        if (!get().connected) {
          toast.error("Not connected to server. Please try again.");
          return;
        }

        if (currentRoom) {
          socket.emit("leave_room", currentRoom);
        }

        set({
          room: roomId,
          messages: [],
          error: null
        });

        socket.emit("join_room", roomId);
      },

      joinGlobal: () => {
        const currentRoom = get().room;

        if (!get().connected) {
          toast.error("Not connected to server. Please try again.");
          return;
        }

        if (currentRoom) {
          socket.emit("leave_room", currentRoom);
        }

        set({
          room: null,
          messages: [],
          error: null
        });
      },

      leaveRoom: () => {
        const currentRoom = get().room;

        if (!currentRoom) return;

        socket.emit("leave_room", currentRoom);

        set({
          room: null,
          messages: [],
          error: null
        });
      },

      sendMessage: (msg) => {
        if (!msg.trim()) {
          toast.error("Message cannot be empty");
          return;
        }

        if (!get().connected) {
          toast.error("Not connected. Please reconnect.");
          return;
        }

        const room = get().room;

        if (room) {
          socket.emit("send_message", {
            msg: msg.trim(),
            roomId: room,
          });
        } else {
          socket.emit("send_message", {
            global: true,
            msg: msg.trim(),
          });
        }
      },

      clearError: () => {
        set({ error: null });
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