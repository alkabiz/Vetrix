import { type NextRequest, NextResponse } from "next/server"
import { getAccessToken } from "@/lib/auth/cookie-utils"
import { verifyToken } from "@/lib/auth/auth"
import { getDatabase } from "@/lib/database/database"
import type { DashboardMetricsDTO } from "@/lib/api/types/dto"

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

        // Queries
        // Owners count
        const ownersCount = db.prepare('SELECT COUNT(*) as count FROM mas_owners WHERE isActive = 1').get() as { count: number }

        // Pets count
        const petsCount = db.prepare('SELECT COUNT(*) as count FROM mas_pets WHERE isActive = 1').get() as { count: number }

        // Today's appointments
        const appointmentsCount = db.prepare(
            'SELECT COUNT(*) as count FROM cit_appointments WHERE date(appointmentDate) = ?'
        ).get(today) as { count: number }

        // Monthly revenue (sum of paid invoices for current month)
        // Using invoiceDate for revenue attribution
        const revenueResult = db.prepare(`
            SELECT SUM(totalAmount) as total 
            FROM fac_invoices 
            WHERE strftime('%Y-%m', invoiceDate) = ? 
            AND status = 'paid'
        `).get(currentMonth) as { total: number | null }

        // 3. Form DTO
        const metrics: DashboardMetricsDTO = {
            owners: ownersCount.count,
            pets: petsCount.count,
            todaysAppointments: appointmentsCount.count,
            monthlyRevenue: revenueResult.total || 0
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
