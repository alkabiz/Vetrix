import Database from "better-sqlite3"
import { join } from "path"

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    const dbPath = join(process.cwd(), "veterinary.db")
    db = new Database(dbPath)

    // Enable foreign keys
    db.pragma("foreign_keys = ON")
  }
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}

// Types for our entities
export interface Owner {
  id?: number
  name: string
  phone?: string
  email?: string
  address?: string
  created_at?: string
  updated_at?: string
}

export interface Pet {
  id?: number
  owner_id: number
  name: string
  species: string
  breed?: string
  sex?: "Male" | "Female" | "Unknown"
  age?: number
  weight?: number
  notes?: string
  created_at?: string
  updated_at?: string
  owner_name?: string // For joined queries
}

export interface Appointment {
  id?: number
  pet_id: number
  owner_id: number
  appointment_date: string
  appointment_time: string
  assigned_vet?: string
  status: "pending" | "completed" | "canceled"
  notes?: string
  created_at?: string
  updated_at?: string
  pet_name?: string // For joined queries
  owner_name?: string // For joined queries
}

export interface MedicalRecord {
  id?: number
  pet_id: number
  appointment_id?: number
  visit_date: string
  reason_for_visit: string
  diagnosis?: string
  treatment?: string
  notes?: string
  created_at?: string
  updated_at?: string
  pet_name?: string // For joined queries
}

export interface Invoice {
  id?: number
  owner_id: number
  pet_id: number
  appointment_id?: number
  invoice_date: string
  services: string // JSON string
  total_amount: number
  status: "pending" | "paid" | "overdue"
  notes?: string
  created_at?: string
  updated_at?: string
  owner_name?: string // For joined queries
  pet_name?: string // For joined queries
}
