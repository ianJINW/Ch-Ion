import type { FC } from "react";
import { Link } from "react-router-dom";
import { Home, LogOut, MessageCircle, UserIcon } from "lucide-react"
import useAuthStore from "../store/auth.store";

const NavBar: FC = () => {
  const logout = useAuthStore(s => s.logout)
  const user = useAuthStore(s => s.user)

  const logoutFN = () => {
    logout()
  }

  return (
    <header className="flex items-center justify-between gap-4 bg-neutral-900 border-b border-neutral-800 px-4 py-3">
      <Link to="/" className="flex items-center gap-2 text-neutral-200 hover:text-white">
        <Home />
        <span>Home</span>
      </Link>

      <section>
        <Link to="/chat" className="text-neutral-300 hover:text-white flex items-center gap-2">
          <MessageCircle /> Chats
        </Link>
      </section>

      <button onClick={logoutFN} className="text-neutral-300 hover:text-white">
        {user ? <LogOut /> : <UserIcon />}
      </button>
    </header>
  )
}

export default NavBar