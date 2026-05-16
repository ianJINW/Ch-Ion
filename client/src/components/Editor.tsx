import { type FC, type FormEvent, useState } from "react";
import { toast } from "sonner";
import { usePostData } from "../lib/data-api";

type Props = {
  onCreated: (roomId: string) => void;
};

type RoomResponse = {
  room: {
    _id: string;
    name: string;
  };
  message: string;
};

const Editor: FC<Props> = ({ onCreated }) => {
  const [name, setName] = useState("");

  const { mutateAsync, isPending } = usePostData(import.meta.env.VITE_ROOM_URL)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isPending) return;

    if (!name.trim()) {
      toast.error("Chat name required");
      return;
    }

    try {
      const data: RoomResponse = await mutateAsync({ name })

      toast.success(`Chat created: ${name}`);

      onCreated(data.room._id);
      setName("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create chat";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1 text-white/80">Chat name</label>

        <input
          type="text"
          value={name}
          disabled={isPending}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dressrosa"
          className="w-full rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-sky-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full rounded-2xl bg-sky-500 py-3 text-white font-medium transition disabled:opacity-50 hover:bg-sky-400"
      >
        {isPending ? "Creating..." : "Create Chat"}
      </button>
    </form>
  );
};

export default Editor;