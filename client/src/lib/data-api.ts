import { useQuery } from "@tanstack/react-query"
import api from "./axios"
import { toast } from "sonner"

const reqData = async (url: string) => {
  const req = await api.get(url)

  return req.data
}

export const useGetData = (url: string) => {
  return useQuery({
    queryKey: ['data', url],
    queryFn: () => reqData(url),
    onSuccess: () => {
      toast.info(`Data retrieved successfully`)
    },
    onError: () => {
      toast.error('Data not retrieved.')
    }
  })
}

