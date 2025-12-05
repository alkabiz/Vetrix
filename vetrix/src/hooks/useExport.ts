import { useState } from "react"
import { parse } from "papaparse"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { UserDTO, ExportFormat } from "@/lib/api/types/user.types"
import { useToast } from "@/hooks/use-toast"

/**
 * Custom hook for exporting user data to CSV or PDF
 */
export function useExport() {
    const [isExporting, setIsExporting] = useState(false)
    const { toast } = useToast()

    /**
     * Export users to CSV
     */
    const exportToCSV = (users: UserDTO[], filename: string = "users.csv") => {
        try {
            setIsExporting(true)

            // Prepare data for CSV
            const csvData = users.map(user => ({
                ID: user.id,
                Username: user.username,
                Email: user.email,
                Role: getRoleName(user.roleId),
                Status: user.statusId,
                "Created At": user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
            }))

            // Convert to CSV string
            const csv = [
                Object.keys(csvData[0]).join(","),
                ...csvData.map(row => Object.values(row).join(",")),
            ].join("\n")

            // Create and download file
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
            const link = document.createElement("a")
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()

            toast({
                title: "Success",
                description: `Exported ${users.length} users to CSV`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export to CSV",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    /**
     * Export users to PDF
     */
    const exportToPDF = (users: UserDTO[], filename: string = "users.pdf") => {
        try {
            setIsExporting(true)

            const doc = new jsPDF()

            // Add title
            doc.setFontSize(18)
            doc.text("User List", 14, 22)

            // Add metadata
            doc.setFontSize(11)
            doc.setTextColor(100)
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32)
            doc.text(`Total Users: ${users.length}`, 14, 38)

            // Prepare table data
            const tableData = users.map(user => [
                user.id.toString(),
                user.username,
                user.email,
                getRoleName(user.roleId),
                user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
            ])

            // Generate table
            autoTable(doc, {
                head: [["ID", "Username", "Email", "Role", "Created"]],
                body: tableData,
                startY: 45,
                theme: "grid",
                headStyles: {
                    fillColor: [59, 130, 246], // Blue-500
                    textColor: 255,
                    fontStyle: "bold",
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 50 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 30 },
                },
            })

            // Save PDF
            doc.save(filename)

            toast({
                title: "Success",
                description: `Exported ${users.length} users to PDF`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to export to PDF",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    /**
     * Export users based on format
     */
    const exportUsers = (users: UserDTO[], format: ExportFormat, filename?: string) => {
        const timestamp = new Date().toISOString().split("T")[0]
        const defaultFilename = `users-${timestamp}`

        if (format === "csv") {
            exportToCSV(users, filename || `${defaultFilename}.csv`)
        } else if (format === "pdf") {
            exportToPDF(users, filename || `${defaultFilename}.pdf`)
        }
    }

    return {
        exportUsers,
        exportToCSV,
        exportToPDF,
        isExporting,
    }
}

/**
 * Helper function to get role name
 */
function getRoleName(roleId: number): string {
    switch (roleId) {
        case 1:
            return "Admin"
        case 2:
            return "Vet"
        case 3:
            return "Assistant"
        default:
            return "User"
    }
}
