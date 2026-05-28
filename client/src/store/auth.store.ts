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
  login: (user: User) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      login: (user) => {
        set({ user })
      },
      logout: () => {
        set({ user: null })
      }
    }),
    {
      name: "auth-storage"
    }
  )
)

export default useAuthStore