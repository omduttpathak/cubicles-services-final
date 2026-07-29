import axios from "axios"

import { getAccessToken, removeAccessToken } from "@/utils/auth"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    /*
     * Let the browser set the correct multipart
     * Content-Type and boundary for FormData.
     *
     * For normal objects, Axios automatically sends
     * application/json.
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      removeAccessToken()

      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.href = "/admin/login"
      }
    }

    if (error.response) {
      console.error(`[API Error] ${error.response.status}`, error.response.data)
    } else {
      console.error("[Network Error]", error.message)
    }

    return Promise.reject(error)
  }
)

export default api
