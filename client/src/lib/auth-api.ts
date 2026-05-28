import { useMutation, useQuery } from "@tanstack/react-query"

import api from "./axios"
import useAuthStore from "../store/auth.store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export interface registerForm {
  username: string
  email: string
  password: string
}

export interface loginForm {
  email: string
  password: string
}

const register = async (formData: registerForm, url: string) => {
  const endpoint = url || '/api/user';
  const req = await api.post(endpoint, formData)
  return req.data
}

const loginFN = async (formData: loginForm, url: string) => {
  const endpoint = url || '/api/user/login';
  const req = await api.post(endpoint, formData)

  console.log(req.data);

  return req.data
}

const logout = async () => {
  const endpoint = import.meta.env.VITE_LOGOUT_URL || '/api/user/logout';
  const req = await api.post(endpoint)

  console.log(req.data);

  return req.data
}

export const useLoginApi = (url: string) => {
  const login = useAuthStore(s => s.login)
  const [, setSearchParams] = useSearchParams({ mode: "login" });
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (formData: loginForm) => loginFN(formData, url),
    onSuccess: data => {
      login(data.user)
      toast.success(`Logged in successfully`)
      navigate('/chat')
    },
    onError: () => {
      toast.error(`User login failed. Let's try again.`)
      setSearchParams({ mode: 'login' })
    }
  })
}

export const useRegisterApi = (url: string) => {
  const [, setSearchParams] = useSearchParams({ mode: "register" });

  return useMutation({
    mutationFn: (formdata: registerForm) => register(formdata, url),
    onSuccess: () => {
      toast.info(`User registered successfully`)
      setSearchParams({ mode: 'login' })
    },
    onError: () => {
      toast.error(`User registration failed. Let's try again.`)
      setSearchParams({ mode: 'register' })
    }
  })
}

export const useLogoutApi = () => {

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => toast.info(`Logged out successfully`),
    onError: () => toast.error(`Log out unsuccessful.`)
  })
}

const fetchAuth = async (url: string) => {
  const endpoint = url || '/api/user/me';
  const req = await api.get(endpoint)
  return req.data
}

export const useAuthApi = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => fetchAuth(import.meta.env.VITE_AUTH_URL),
    retry: false,
    refetchOnWindowFocus: false,
  })
}