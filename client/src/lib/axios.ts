import axios from "axios";

const base = import.meta.env.VITE_API_URL ?? '';

const api = axios.create({
  baseURL: base,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default api;