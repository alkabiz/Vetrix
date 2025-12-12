
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/src/app/api/dashboard/metrics/route'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/auth/cookie-utils', () => ({
    getAccessToken: vi.fn()
}))

vi.mock('@/lib/auth/auth', () => ({
    verifyToken: vi.fn()
}))

vi.mock('@/lib/database/database', () => ({
    getDatabase: vi.fn()
}))

import { getAccessToken } from '@/lib/auth/cookie-utils'
import { verifyToken } from "@/lib/auth-server"
import { getDatabase } from '@/lib/database/database'

describe('GET /api/dashboard/metrics', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createRequest = () => {
        return new NextRequest('http://localhost:3000/api/dashboard/metrics')
    }

    it('returns 401 if no token provided', async () => {
        vi.mocked(getAccessToken).mockReturnValue(null)

        const response = await GET(createRequest())
        expect(response.status).toBe(401)
        const data = await response.json()
        expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('returns 401 if token invalid', async () => {
        vi.mocked(getAccessToken).mockReturnValue('invalid_token')
        vi.mocked(verifyToken).mockReturnValue(null)

        const response = await GET(createRequest())
        expect(response.status).toBe(401)
    })

    it('returns metrics data on success', async () => {
        vi.mocked(getAccessToken).mockReturnValue('valid_token')
        vi.mocked(verifyToken).mockReturnValue({ id: 1, role: 'admin' } as any)

        // Mock database
        const mockDb = {
            prepare: vi.fn((query: string) => {
                const queryStr = query.toLowerCase()
                let value = 0

                if (queryStr.includes('mas_owners')) value = 10
                if (queryStr.includes('mas_pets')) value = 20
                if (queryStr.includes('cit_appointments')) value = 5
                if (queryStr.includes('fac_invoices')) return { get: () => ({ total: 1000 }) }

                return { get: () => ({ count: value }) }
            })
        }
        vi.mocked(getDatabase).mockReturnValue(mockDb as any)

        const response = await GET(createRequest())
        expect(response.status).toBe(200)

        const data = await response.json()
        expect(data).toEqual({
            owners: 10,
            pets: 20,
            todaysAppointments: 5,
            monthlyRevenue: 1000
        })
    })

    it('handles database errors gracefully', async () => {
        vi.mocked(getAccessToken).mockReturnValue('valid_token')
        vi.mocked(verifyToken).mockReturnValue({ id: 1 } as any)

        vi.mocked(getDatabase).mockImplementation(() => {
            throw new Error('Database connection failed')
        })

        const response = await GET(createRequest())
        expect(response.status).toBe(500)
        const data = await response.json()
        expect(data).toEqual({ error: 'Failed to fetch dashboard metrics' })
    })
})
