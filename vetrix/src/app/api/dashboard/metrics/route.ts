import { type NextRequest, NextResponse } from "next/server"
import { getAccessToken } from "@/lib/auth/cookie-utils"
import { verifyToken } from "@/lib/auth-server"
import { getDatabase } from "@/lib/database/database"
import type { DashboardMetricsDTO } from "@/lib/api/types/dto"

/** Safely run a single DB query that returns a count, defaulting to 0 on any error */
function safeCount(query: () => { count: number } | null | undefined): number {
    try {
        const result = query()
        return result?.count ?? 0
    } catch (err) {
        console.warn("[Dashboard] DB query failed, defaulting to 0:", (err as Error).message)
        return 0
    }
}

/** Safely run a DB query that returns a numeric total, defaulting to 0 on any error */
function safeTotal(query: () => { total: number | null } | null | undefined): number {
    try {
        const result = query()
        return result?.total ?? 0
    } catch (err) {
        console.warn("[Dashboard] DB query failed, defaulting to 0:", (err as Error).message)
        return 0
    }
}

export async function GET(request: NextRequest) {
    try {
        // 1. Authenticate
        const token = getAccessToken(request)
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        // 2. Fetch Metrics in Parallel
        const db = getDatabase()

        // Dates
        const today = new Date().toISOString().split('T')[0]
        const currentMonth = today.slice(0, 7) // YYYY-MM

        // Owners count
        const ownersCount = safeCount(() =>
            db.prepare('SELECT COUNT(*) as count FROM mas_owners WHERE isActive = 1').get() as { count: number }
        )

        // Pets count
        const petsCount = safeCount(() =>
            db.prepare('SELECT COUNT(*) as count FROM mas_pets WHERE isActive = 1').get() as { count: number }
        )

        // Today's appointments — try appointmentDate first, fall back to appointmentDatetime
        const todaysAppointments = safeCount(() => {
            try {
                return db.prepare(
                    'SELECT COUNT(*) as count FROM cit_appointments WHERE date(appointmentDate) = ?'
                ).get(today) as { count: number }
            } catch {
                // Try alternative column name used in some schema versions
                return db.prepare(
                    'SELECT COUNT(*) as count FROM cit_appointments WHERE date(appointmentDatetime) = ?'
                ).get(today) as { count: number }
            }
        })

        // Monthly revenue — try with status='paid', fall back gracefully
        const monthlyRevenue = safeTotal(() =>
            db.prepare(`
                SELECT COALESCE(SUM(totalAmount), 0) as total
                FROM fac_invoices
                WHERE strftime('%Y-%m', invoiceDate) = ?
                AND status = 'paid'
            `).get(currentMonth) as { total: number | null }
        )

        // 3. Form DTO
        const metrics: DashboardMetricsDTO = {
            owners: ownersCount,
            pets: petsCount,
            todaysAppointments,
            monthlyRevenue,
        }

        return NextResponse.json(metrics)

    } catch (error) {
        console.error("Dashboard metrics error:", error)
        return NextResponse.json(
            { error: "Failed to fetch dashboard metrics" },
            { status: 500 }
        )
    }
}
