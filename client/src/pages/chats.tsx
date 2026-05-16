import { PlusIcon, XIcon } from "lucide-react";
import { useMemo, useState, type FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "../components/Editor";
import { useGetData } from "../lib/data-api";
import { toast } from 'sonner';
import useAuthStore from "../store/auth.store";
import useChatStore from "../store/chat.store";

type Room = {
  _id: string;
  name: string;
};

const Chats: FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const joinRoom = useChatStore((s) => s.joinRoom);
  const joinGlobal = useChatStore((s) => s.joinGlobal);
  const { data, isPending, isError } = useGetData(import.meta.env.VITE_ROOM_URL);

  // -----------------------------
  // FETCH ROOMS
  // -----------------------------

  const rooms: Room[] = useMemo(() => {
    if (!data) return [];
    return data.rooms ?? data;
  }, [data]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleJoinRoom = (roomId: string) => {
    joinRoom(roomId);
    navigate(`/chat/${roomId}`);
  };

  if (isError) toast.error(`Error loading islands`);
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:grid lg:grid-cols-[320px_1fr] lg:items-start lg:gap-10">
        <aside className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Chat islands</h2>
              <p className="text-sm text-neutral-400">Browse rooms or create a new island.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowEditor(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white transition hover:bg-sky-400"
              aria-label="Create room"
            >
              <PlusIcon size={20} />
            </button>
          </div>

          {isPending ? (
            <p className="text-sm text-neutral-400">Loading chat islands...</p>
          ) : rooms.length === 0 ? (
            <p className="text-sm text-neutral-400">No chat islands available yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {rooms.map((room) => (
                <button
                  key={room._id}
                  type="button"
                  onClick={() => handleJoinRoom(room._id)}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-left transition hover:border-sky-500"
                >
                  <span className="block text-sm font-medium">🏝️ {room.name}</span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              joinGlobal();
              navigate('/chat');
            }}
            className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-neutral-800 px-4 py-3 text-sm text-neutral-200 transition hover:bg-neutral-700"
          >
            Join global chat
          </button>
        </aside>

        <section className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm">
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-3xl font-semibold">Welcome back</h2>
              <p className="mt-2 text-neutral-400">Select a room to enter chat, or use the global chat room for everyone.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Active user</p>
                <p className="mt-3 text-lg font-medium">{user?.username ?? 'Guest'}</p>
              </div>
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Rooms available</p>
                <p className="mt-3 text-lg font-medium">{rooms.length}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showEditor && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 py-6">
          <div className="relative w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="absolute right-4 top-4 text-neutral-400 transition hover:text-white"
              aria-label="Close create room dialog"
            >
              <XIcon size={24} />
            </button>

            <Editor
              onCreated={(roomId) => {
                setShowEditor(false);
                handleJoinRoom(roomId);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Chats;