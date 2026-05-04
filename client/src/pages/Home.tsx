import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, LogOut, User } from "lucide-react";
import useAuthStore from "../store/auth.store";
import { useGetData } from "../lib/data-api";

const Home: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();


  const { data, isPending } = useGetData("user/me");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Home</h1>

        <button
          className="flex items-center gap-2 text-sm bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/20 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* User Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-neutral-800 p-3 rounded-full">
            <User />
          </div>

          <div>
            <p className="text-lg font-medium">{user.username}</p>
            <p className="text-sm text-neutral-400">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Protected Data</h2>

        {isPending ? (
          <p className="text-neutral-400">Loading...</p>
        ) : (
          <pre className="text-sm text-neutral-300 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/chat")}
          className="flex items-center justify-center gap-2 bg-white text-black p-4 rounded-xl font-medium hover:bg-neutral-200 transition"
        >
          <MessageCircle size={18} />
          Go to Chat
        </button>
      </div>
    </div>
  );
};

export default Home