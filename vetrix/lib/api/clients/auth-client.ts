import { apiClient } from "./api-client"
import type { User } from "@/lib/database/database"

export interface LoginRequest {
    email: string
    passwordHash: string // In a real app, this would be 'password' and hashed on server, but matching DB interface for now
}

export interface LoginResponse {
    token: string
    user: User
}

export interface RegisterRequest {
    username: string
    email: string
    passwordHash: string
    roleId: number
}

export const authClient = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const { data } = await apiClient.post<LoginResponse>("/auth/login", credentials)
        return data
    },

    register: async (userData: RegisterRequest): Promise<User> => {
        const { data } = await apiClient.post<User>("/auth/register", userData)
        return data
    },

    logout: async (): Promise<void> => {
        await apiClient.post("/auth/logout")
    },

    getSession: async (): Promise<User> => {
        const { data } = await apiClient.get<User>("/auth/session")
        return data
    },
}
