"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { InvoiceForm } from "@/components/invoice-form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Receipt, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Invoice, Owner, Pet, Appointment } from "@/lib/database"

const mockInvoices: Invoice[] = [
  {
    id: 1,
    owner_id: 1,
    owner_name: "John Smith",
    pet_id: 1,
    pet_name: "Buddy",
    appointment_id: 1,
    invoice_date: "2024-01-15",
    due_date: "2024-02-15",
    services: JSON.stringify(["Annual checkup", "Dental cleaning"]),
    total_amount: 150.0,
    status: "paid",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: 2,
    owner_id: 2,
    owner_name: "Jane Doe",
    pet_id: 2,
    pet_name: "Whiskers",
    appointment_id: 2,
    invoice_date: "2024-01-20",
    due_date: "2024-02-20",
    services: JSON.stringify(["Examination", "Anti-inflammatory medication"]),
    total_amount: 85.0,
    status: "pending",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    owner_id: 3,
    owner_name: "Bob Johnson",
    pet_id: 3,
    pet_name: "Charlie",
    appointment_id: 3,
    invoice_date: "2024-01-25",
    due_date: "2024-02-25",
    services: JSON.stringify(["Vaccination", "Health certificate"]),
    total_amount: 120.0,
    status: "overdue",
    created_at: "2024-01-25T09:15:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
]

const mockOwners: Owner[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "555-0101",
    address: "123 Main St",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-0102",
    address: "456 Oak Ave",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "555-0103",
    address: "789 Pine Rd",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const mockPets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 5,
    owner_id: 1,
    owner_name: "John Smith",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Whiskers",
    species: "Cat",
    breed: "Persian",
    age: 3,
    owner_id: 2,
    owner_name: "Jane Doe",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: 2,
    owner_id: 3,
    owner_name: "Bob Johnson",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const mockAppointments: Appointment[] = [
  {
    id: 1,
    pet_id: 1,
    pet_name: "Buddy",
    owner_name: "John Smith",
    appointment_date: "2024-01-15",
    appointment_time: "10:00",
    veterinarian: "Dr. Smith",
    reason: "Annual checkup",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    pet_id: 2,
    pet_name: "Whiskers",
    owner_name: "Jane Doe",
    appointment_date: "2024-01-20",
    appointment_time: "14:30",
    veterinarian: "Dr. Johnson",
    reason: "Limping",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    pet_id: 3,
    pet_name: "Charlie",
    owner_name: "Bob Johnson",
    appointment_date: "2024-01-25",
    appointment_time: "09:15",
    veterinarian: "Dr. Smith",
    reason: "Vaccination",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [owners] = useState<Owner[]>(mockOwners)
  const [pets] = useState<Pet[]>(mockPets)
  const [appointments] = useState<Appointment[]>(mockAppointments)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()

  const handleAddInvoice = () => {
    setSelectedInvoice(null)
    setIsFormOpen(true)
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsFormOpen(true)
  }

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete this invoice for ${invoice.owner_name}?`)) {
      return
    }

    setInvoices(invoices.filter((i) => i.id !== invoice.id))
    toast({
      title: "Success",
      description: "Invoice deleted successfully",
    })
  }

  const handleSubmitInvoice = async (
    invoiceData: Omit<Invoice, "id" | "created_at" | "updated_at" | "owner_name" | "pet_name">,
  ) => {
    if (selectedInvoice) {
      // Update existing invoice
      const updatedInvoice = {
        ...selectedInvoice,
        ...invoiceData,
        owner_name: owners.find((o) => o.id === invoiceData.owner_id)?.name || "",
        pet_name: pets.find((p) => p.id === invoiceData.pet_id)?.name || "",
        updated_at: new Date().toISOString(),
      }
      setInvoices(invoices.map((i) => (i.id === selectedInvoice.id ? updatedInvoice : i)))
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      })
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        ...invoiceData,
        id: Math.max(...invoices.map((i) => i.id)) + 1,
        owner_name: owners.find((o) => o.id === invoiceData.owner_id)?.name || "",
        pet_name: pets.find((p) => p.id === invoiceData.pet_id)?.name || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setInvoices([...invoices, newInvoice])
      toast({
        title: "Success",
        description: "Invoice created successfully",
      })
    }
    setIsFormOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            Paid
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter === "all") return true
    return invoice.status === statusFilter
  })

  const columns = [
    {
      key: "invoice_date",
      label: "Date",
      render: (value: string) => formatDate(value),
    },
    { key: "owner_name", label: "Owner" },
    { key: "pet_name", label: "Pet" },
    {
      key: "total_amount",
      label: "Amount",
      render: (value: number) => <div className="font-medium">{formatCurrency(value)}</div>,
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "services",
      label: "Services",
      render: (value: string) => {
        try {
          const services = JSON.parse(value) as string[]
          return (
            <div className="max-w-xs">
              <div className="text-sm text-muted-foreground">
                {services.length} service{services.length !== 1 ? "s" : ""}
              </div>
              <div className="text-xs truncate" title={services.join(", ")}>
                {services.slice(0, 2).join(", ")}
                {services.length > 2 && "..."}
              </div>
            </div>
          )
        } catch {
          return <span className="text-muted-foreground">-</span>
        }
      },
    },
  ]

  // Calculate stats
  const stats = {
    total: invoices.length,
    pending: invoices.filter((i) => i.status === "pending").length,
    paid: invoices.filter((i) => i.status === "paid").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    totalRevenue: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total_amount, 0),
    pendingAmount: invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.total_amount, 0),
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage billing and payment tracking</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{stats.paid} paid invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.pendingAmount)}</div>
              <p className="text-xs text-muted-foreground">{stats.pending} pending invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium">
              Filter by status:
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          title="Invoice Records"
          description={`${filteredInvoices.length} invoice${filteredInvoices.length !== 1 ? "s" : ""} ${statusFilter !== "all" ? `with ${statusFilter} status` : ""}`}
          data={filteredInvoices}
          columns={columns}
          onAdd={handleAddInvoice}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          searchPlaceholder="Search invoices..."
          addButtonText="Create Invoice"
        />

        <InvoiceForm
          invoice={selectedInvoice}
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
