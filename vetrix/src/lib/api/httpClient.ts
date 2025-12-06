import { AuthResponse } from "@/lib/api/types/dto"

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

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type")
  const isJson = contentType?.includes("application/json")
  
  if (!response.ok) {
    let errorMessage = "An error occurred"
    let errorCode = "UNKNOWN_ERROR"
    let errorDetails = null

    if (isJson) {
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorData.message || errorMessage
        errorCode = errorData.code || errorCode
        errorDetails = errorData.details
      } catch {
        // failed to parse error json
      }
    } else {
        errorMessage = await response.text()
    }

    throw new AppError(errorMessage, response.status, errorCode, errorDetails)
  }

  if (isJson) {
    return response.json()
  }

  return response.text() as unknown as T
}

// Main HTTP Client
export const httpClient = {
  async get<T>(url: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options
    const queryString = params 
      ? "?" + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value)
            return acc
          }, {} as Record<string, string>)
        ).toString()
      : ""

    const response = await fetch(url + queryString, {
      ...init,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    })

    return handleResponse<T>(response)
  },

  async post<T>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options
    const response = await fetch(url, {
      ...init,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      body: JSON.stringify(body),
    })

    return handleResponse<T>(response)
  },

  async put<T>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
     const { params, ...init } = options
    const response = await fetch(url, {
      ...init,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
      body: JSON.stringify(body),
    })

    return handleResponse<T>(response)
  },

  async delete<T>(url: string, options: FetchOptions = {}): Promise<T> {
     const { params, ...init } = options
    const response = await fetch(url, {
      ...init,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    })

    return handleResponse<T>(response)
  }
}
