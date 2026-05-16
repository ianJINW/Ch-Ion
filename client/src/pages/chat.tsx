import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/auth.store";
import useChatStore from "../store/chat.store";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { messages, room, connected, joinRoom, joinGlobal, leaveRoom, sendMessage } = useChatStore();
  const [input, setInput] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (id && id !== room) {
      joinRoom(id);
    }
  }, [id, room, joinRoom]);

  useEffect(() => {
    const scrollTo = messageListRef.current;
    if (scrollTo) {
      requestAnimationFrame(() => {
        scrollTo.scrollTop = scrollTo.scrollHeight;
      });
    }
  }, [messages]);

  const currentRoomLabel = room ? `Island: ${room}` : "Global Chat";
  const senderId = user?.id ?? "";

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleJoinRoom = () => {
    const roomId = roomInput.trim();
    if (!roomId) return;
    joinRoom(roomId);
    navigate(`/chat/${roomId}`);
    setRoomInput("");
  };

  const mappedMessages = useMemo(
    () => messages.map((message) => {
      const isMe = message.senderId === senderId;
      return {
        ...message,
        senderLabel: isMe ? 'You' : message.senderId.slice(0, 6),
        isMe,
        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }),
    [messages, senderId]
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{currentRoomLabel}</h2>
              <p className="text-sm text-neutral-400">{connected ? 'Connected to chat server' : 'Connecting...'}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {room && (
                <button
                  type="button"
                  onClick={() => {
                    leaveRoom();
                    navigate('/chat');
                  }}
                  className="rounded-2xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-200 transition hover:border-sky-500"
                >
                  Leave room
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  joinGlobal();
                  navigate('/chat');
                }}
                className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
              >
                Global chat
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1.5fr_auto] items-end">
            <div className="space-y-2">
              <label className="text-sm text-neutral-400" htmlFor="roomId">Room ID</label>
              <input
                id="roomId"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Enter room ID"
                className="w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleJoinRoom}
                className="rounded-2xl bg-sky-500 px-4 py-3 text-white font-medium transition hover:bg-sky-400 disabled:opacity-60"
              >
                Join Room
              </button>
              <button
                type="button"
                onClick={() => {
                  joinGlobal();
                  navigate('/chat');
                }}
                className="rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-200 hover:border-sky-500 transition"
              >
                Switch to global
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-neutral-800 bg-neutral-900 p-5 shadow-inner">
          <div ref={messageListRef} className="flex max-h-[55vh] flex-col gap-4 overflow-y-auto pr-2">
            {mappedMessages.length === 0 ? (
              <div className="rounded-3xl bg-neutral-950 p-6 text-center text-neutral-400">
                No messages yet. Start the conversation.
              </div>
            ) : (
              mappedMessages.map((message) => (
                <div
                  key={message._id}
                  className={`flex flex-col gap-2 ${message.isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-xs text-neutral-500">
                    {message.senderLabel} · {message.time}
                  </div>
                  <div className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-6 ${message.isMe ? 'bg-sky-500 text-slate-950' : 'bg-neutral-800 text-white'}`}>
                    {message.msg}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 rounded-3xl border border-neutral-700 bg-neutral-950 px-4 py-4 text-white outline-none transition focus:border-sky-500"
          />
          <button
            type="submit"
            className="rounded-3xl bg-sky-500 px-6 py-4 text-white font-medium transition hover:bg-sky-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
