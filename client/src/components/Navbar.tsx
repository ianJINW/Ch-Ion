import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, MessageCircle } from "lucide-react";
import useAuthStore from "../store/auth.store";

const NavBar: FC = () => {
  const logout = useAuthStore(s => s.logout)
  const user = useAuthStore(s => s.user)

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900 border-b border-neutral-800 px-4 py-3">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-neutral-200 hover:text-white">
          <Home size={18} />
          <span className="font-semibold">Home</span>
        </Link>
        <Link to="/chat" className="inline-flex items-center gap-2 text-neutral-300 hover:text-white">
          <MessageCircle size={18} />
          Chats
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm text-neutral-400">{user.username}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white transition hover:border-sky-500"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/auth')}
            className="rounded-full border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white transition hover:border-sky-500"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default NavBar