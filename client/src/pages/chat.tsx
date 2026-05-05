import { useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatPage() {
  const { messages, room, joinRoom, joinGlobal, sendMessage } = useSocket();
  const [input, setInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">
          {room ? `Room: ${room}` : "🌍 Global Chat"}
        </h2>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
          <div className="space-y-2">
            <label className="text-sm text-neutral-400">Room ID</label>
            <input
              placeholder="Enter room ID"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => joinRoom(roomInput)}
              className="rounded-xl bg-white px-4 py-3 text-black font-medium hover:bg-neutral-200 transition"
            >
              Join Room
            </button>
            <button
              onClick={joinGlobal}
              className="rounded-xl border border-neutral-700 px-4 py-3 text-neutral-200 hover:border-neutral-500 transition"
            >
              Global
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 h-72 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className="mb-3">
              <strong className="text-neutral-200">{m.senderId}:</strong>{' '}
              <span className="text-neutral-300">{m.msg}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white"
          />
          <button
            onClick={() => {
              sendMessage(input);
              setInput("");
            }}
            className="rounded-xl bg-white px-6 py-3 text-black font-medium hover:bg-neutral-200 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
