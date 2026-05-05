import { useQuery } from "@tanstack/react-query"
import api from "./axios"

const reqData = async (url: string) => {
  const req = await api.get(url)

  return req.data
}

export const useGetData = (url: string) => {
  return useQuery({
    queryKey: ['data', url],
    queryFn: () => reqData(url),
  })
}

