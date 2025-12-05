import { User } from "@/lib/database/database"

export type UserEntity = User

/**
 * UserDTO - API response type for user data
 * Excludes sensitive fields like passwordHash
 */
export interface UserDTO extends Omit<UserEntity, "passwordHash" | "currentSessionId"> {
    // Add any computed fields if needed (UserDTO already inherits createdAt as required string)
}

/**
 * UserInput - Input type for creating a new user
 * Maps to registration form data
 */
export interface UserInput {
    username: string
    email: string
    password: string
    roleId: number
}

/**
 * UserUpdateInput - Input type for updating an existing user
 * All fields except id are optional
 */
export interface UserUpdateInput {
    username?: string
    email?: string
    roleId?: number
    statusId?: number
}

/**
 * UserFilter - Filter options for querying users
 */
export interface UserFilter {
    roleId?: number
    statusId?: number
    search?: string
}
