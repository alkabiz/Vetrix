import axios from "axios"
import { authInterceptor, responseInterceptor, errorInterceptor } from "../middleware/api-middleware"

/**
 * Centralized Axios instance for API requests.
 * Configured with base URL, timeout, and interceptors.
 */
export const apiClient = axios.create({
    baseURL: "/api",
    timeout: 10000, // 10 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
})

// Apply interceptors
apiClient.interceptors.request.use(authInterceptor, (error) => Promise.reject(error))
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor)

export default apiClient
