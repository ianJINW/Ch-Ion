import { useMutation, useQuery } from "@tanstack/react-query"
import api from "./axios"
import { toast } from "sonner"

export const reqData = async (url: string) => {
  const req = await api.get(url)

  return req.data
}

const postData = async (url: string, data: unknown) => {
  const req = await api.post(url, data)

  return req.data
}

export const useGetData = (url: string) => {

  return useQuery({
    queryKey: ['data', url],
    queryFn: () => reqData(url)
  })
}

export const usePostData = (url: string) => {
  return useMutation({
    mutationFn: (formData: unknown) => postData(url, formData),
    onSuccess: () => {
      toast.info(`Sent successfully`)
    },
    onError: () => {
      toast.error(`Not sent successfully.`)
    }
  })
}
