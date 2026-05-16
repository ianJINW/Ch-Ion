import { PlusIcon, XIcon } from "lucide-react";
import { useMemo, useState, type FC } from "react";
import Editor from "../components/Editor";
import { useGetData } from "../lib/data-api";
import { toast } from 'sonner';
import useChatStore from "../store/chat.store";

type Room = {
  _id: string;
  name: string;
};

const Chats: FC = () => {
  const [showEditor, setShowEditor] = useState(false);
  const joinRoom = useChatStore(s => s.joinRoom)
  const { data, isPending, isError } = useGetData(import.meta.env.VITE_ROOM_URL)

  // -----------------------------
  // FETCH ROOMS
  // -----------------------------

  const rooms: Room[] = useMemo(() => {
    if (!data) return []
    return data.rooms ?? data
  }, [data])

  if (isError) toast.error(`Error in chats`)
  return (
    <main className="flex h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 border-r p-4 space-y-2">
        <h2 className="font-bold text-lg">🌍 Islands</h2>

        {/* EMPTY STATE */}
        {isPending && (
          <p className="text-sm text-gray-500">Loading islands...</p>
        )}

        {!isPending && rooms.length === 0 && (
          <p className="text-sm text-gray-500">No islands found</p>
        )}

        {/* ROOMS */}
        {rooms.map((room) => (
          <div
            key={room._id}
            onClick={() => joinRoom(room._id)}
            className="p-2 rounded cursor-pointer hover:bg-gray-100 transition"
          >
            🏝️ {room.name}
          </div>
        ))}
      </aside>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowEditor(true)}
        className="fixed right-5 bottom-5 w-12 h-12 flex items-center justify-center shadow-lg hover:scale-105 transition rounded-full"
        style={{ backgroundColor: "var(--bg-secondary)" }}
        aria-label="Create room"
      >
        <PlusIcon size={24} className="text-white" />
      </button>

      {/* MODAL */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">

            {/* CLOSE */}
            <button
              onClick={() => setShowEditor(false)}
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
            >
              <XIcon size={24} />
            </button>

            <Editor
              onCreated={(roomId) => {
                setShowEditor(false);
                joinRoom(roomId);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Chats;