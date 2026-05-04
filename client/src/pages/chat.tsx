import { useState } from "react";
import useSocket from "../hooks/useSocket";

export default function ChatPage() {
  const { messages, room, joinRoom, joinGlobal, sendMessage } = useSocket();
  const [input, setInput] = useState("");
  const [roomInput, setRoomInput] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h2>{room ? `Room: ${room}` : "🌍 Global Chat"}</h2>

      {/* JOIN ROOM */}
      <div>
        <input
          placeholder="Enter room ID"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
        />
        <button onClick={() => joinRoom(roomInput)}>Join Room</button>
        <button onClick={joinGlobal}>Global</button>
      </div>

      {/* MESSAGES */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          marginTop: 10,
          padding: 10,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.senderId}:</strong> {m.msg}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}