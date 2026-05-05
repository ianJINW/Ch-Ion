import { useMutation } from "@tanstack/react-query"

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
  const req = await api.post(url, formData)
  return req.data
}

const loginFN = async (formData: loginForm, url: string) => {
  const req = await api.post(url, formData)

  return req.data
}

export const useLoginApi = (url: string) => {
  const login = useAuthStore(s => s.login)
  const [, setSearchParams] = useSearchParams({ mode: "login" });
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (formData: loginForm) => loginFN(formData, url),
    onSuccess: data => {
      login(data.user, data.token)

      toast.info(`User logged in.`)
      navigate('/chat')
    }, onError: (error) => {
      toast.error(`User login failed. Let's try again. ${error}`)
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
    onError: (error) => {
      toast.error(`User registration failed. Let's try again. ${error}`)
      setSearchParams({ mode: 'register' })
    }
  })
}
