import { create } from 'zustand';
import { persist } from "zustand/middleware";

export interface User {
  id: string
  username: string
  email: string
}

export interface AuthI {
  user: User,
}

export interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string | null) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      login: (user, token) => {
        if (token) {
          localStorage.setItem("token", token)
        } else {
          localStorage.removeItem("token")
        }

        set({ user, token })
      },
      logout: () => {
        localStorage.removeItem("token")
        set({ user: null, token: null })
      }
    }),
    {
      name: "auth-storage"
    }
  )
)

export default useAuthStore