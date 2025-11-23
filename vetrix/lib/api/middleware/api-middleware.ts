import type { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios"
import { toast } from "@/hooks/use-toast"

/**
 * Interceptor to inject the authentication token into the request headers.
 */
export const authInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

/**
 * Interceptor to handle successful responses.
 * Currently just passes the response through, but can be used for global success handling.
 */
export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    return response
}

/**
 * Interceptor to handle API errors globally.
 * Handles common status codes like 401, 403, and 500.
 */
export const errorInterceptor = (error: AxiosError): Promise<never> => {
    const status = error.response?.status
    const data = error.response?.data as { message?: string; error?: string } | undefined
    const message = data?.message || data?.error || "An unexpected error occurred"

    if (status === 401) {
        // Unauthorized: Token expired or invalid
        toast({
            title: "Session Expired",
            description: "Please log in again.",
            variant: "destructive",
        })
        // Optional: Redirect to login page or clear local storage
        // localStorage.removeItem("token");
        // window.location.href = "/login";
    } else if (status === 403) {
        // Forbidden: Insufficient permissions
        toast({
            title: "Access Denied",
            description: "You do not have permission to perform this action.",
            variant: "destructive",
        })
    } else if (status === 500) {
        // Internal Server Error
        toast({
            title: "Server Error",
            description: "Something went wrong on our end. Please try again later.",
            variant: "destructive",
        })
    } else if (!window.navigator.onLine) {
        // Network Error
        toast({
            title: "Network Error",
            description: "Please check your internet connection.",
            variant: "destructive",
        })
    } else {
        // Other errors
        toast({
            title: "Error",
            description: message,
            variant: "destructive",
        })
    }

    return Promise.reject(error)
}
