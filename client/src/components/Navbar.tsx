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
    <header className="flex flex-row justify-evenly align-center">
      <Link to={"/"}  ><Home />  </Link>
      <section>
        <Link to={"/chat"}>{<MessageCircle />} Chats</Link>
      </section>

      <button> {user ? (<LogOut onClick={logoutFN} />) : (<UserIcon/>)}</button>
    </header>)
}

export default NavBar