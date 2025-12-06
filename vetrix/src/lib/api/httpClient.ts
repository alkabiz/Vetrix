import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios"

// Standard API Error class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = "AppError"
  }
}

// Create Axios instance with defaults
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api", // Default base URL for Next.js API routes
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
})

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    let errorMessage = "An error occurred"
    let statusCode = 500
    let errorCode = "UNKNOWN_ERROR"
    let errorDetails = null

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status
      const data = error.response.data

      if (typeof data === "object" && data !== null) {
        errorMessage = data.error || data.message || errorMessage
        errorCode = data.code || errorCode
        errorDetails = data.details
      } else if (typeof data === "string") {
        errorMessage = data
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from server"
      errorCode = "NETWORK_ERROR"
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message
    }

    return Promise.reject(new AppError(errorMessage, statusCode, errorCode, errorDetails))
  }
)

// Wrapper to expose unified methods (or export the instance directly)
export const httpClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.get<T>(url, config)
    return response.data
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data, config)
    return response.data
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data, config)
    return response.data
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.delete<T>(url, config)
    return response.data
  },
  
  // Expose the raw instance if needed
  instance: axiosInstance
}
