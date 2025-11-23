"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { NAVIGATION_ITEMS } from "./config/navigation.config"
import { filterNavigationByRole } from "./utils/role-utils"
import { Sidebar } from "./components/Sidebar"
import { TopHeader } from "./components/TopHeader"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()

  const filteredNavigation = useMemo(() => {
    return filterNavigationByRole(NAVIGATION_ITEMS, user?.role)
  }, [user?.role])

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        navigationItems={filteredNavigation}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={logout}
        />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-muted/20">{children}</main>
      </div>
    </div>
  )
}