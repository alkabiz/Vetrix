"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InvoiceForm } from "@/components/forms/invoice/InvoiceForm"
import { useToast } from "@/hooks/use-toast"
import { Invoice } from "@/lib/database/database"
import { InvoiceDTO } from "@/lib/api/types/invoice.types"
import { useInvoices } from "@/src/hooks/useInvoices"
import { useOwners } from "@/src/hooks/useOwners"
import { usePets } from "@/src/hooks/usePets"
import { useAppointments } from "@/src/hooks/useAppointments"
import { InvoiceStats } from "./components/InvoiceStats"
import { InvoiceFilters } from "./components/InvoiceFilters"
import { InvoicesTable } from "./components/InvoicesTable"
import { Pet } from "@/lib/database/database"

export default function InvoicesPage() {
  const { invoices = [], isLoading: isLoadingInvoices, createInvoice, updateInvoice, deleteInvoice } = useInvoices()
  const { owners = [] } = useOwners()
  const { pets: petDTOs = [] } = usePets()
  
  const pets: Pet[] = petDTOs.map((dto) => ({
    ...dto,
    dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    // Add other date conversions if necessary based on Pet type
  })) as unknown as Pet[]
  const { appointments = [] } = useAppointments()

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDTO | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  const handleAddInvoice = () => {
    setSelectedInvoice(null)
    setIsFormOpen(true)
  }

  const handleEditInvoice = (invoice: InvoiceDTO) => {
    setSelectedInvoice(invoice)
    setIsFormOpen(true)
  }

  const handleDeleteInvoice = async (invoice: InvoiceDTO) => {
    if (!confirm(`¿Está seguro de que desea eliminar esta factura por ${invoice.owner_name}?`)) {
      return
    }

    try {
      await deleteInvoice.mutateAsync(invoice.id)
      toast({
        title: "Éxito",
        description: "Factura eliminada con éxito.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la factura.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitInvoice = async (
    invoiceData: Omit<InvoiceDTO, "id" | "created_at" | "updated_at" | "owner_name" | "pet_name">,
  ) => {
    try {
      if (selectedInvoice) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateInvoice.mutateAsync({ id: selectedInvoice.id, ...(invoiceData as any) })
        toast({
          title: "Éxito",
          description: "Factura actualizada con éxito.",
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createInvoice.mutateAsync(invoiceData as any)
        toast({
          title: "Éxito",
          description: "Factura creada con éxito.",
        })
      }
      setIsFormOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la factura.",
        variant: "destructive",
      })
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter === "all") return true
    return invoice.status === statusFilter
  })

  if (isLoadingInvoices) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Cargando facturas...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Facturas</h1>
          <p className="text-muted-foreground">Administrar el seguimiento de facturación y pagos</p>
        </div>

        <InvoiceStats invoices={invoices} />

        <InvoiceFilters currentFilter={statusFilter} onFilterChange={setStatusFilter} />

        <InvoicesTable
          invoices={filteredInvoices}
          onAdd={handleAddInvoice}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          filterStatus={statusFilter}
        />

        <InvoiceForm
          invoice={selectedInvoice as Invoice | null}
          owners={owners}
          pets={pets}
          appointments={appointments}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleSubmitInvoice}
        />
      </div>
    </DashboardLayout>
  )
}
