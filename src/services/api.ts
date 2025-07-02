import axios from "axios"

const baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:9600"

const api = axios.create({
  baseURL,
})

export default api
