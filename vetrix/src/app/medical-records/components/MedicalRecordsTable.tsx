import { DataTable } from "@/components/ui/data-table"
import { Calendar, Heart } from "lucide-react"
import { MedicalRecordDTO } from "@/lib/api/types/medical-record.types"

interface MedicalRecordsTableProps {
    records: MedicalRecordDTO[]
    canModify: boolean
    onAdd?: () => void
    onEdit?: (record: MedicalRecordDTO) => void
    onDelete?: (record: MedicalRecordDTO) => void
    filterStatus: string
}

export function MedicalRecordsTable({
    records,
    canModify,
    onAdd,
    onEdit,
    onDelete,
    filterStatus
}: MedicalRecordsTableProps) {
    const formatDate = (dateStr: string | Date) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const columns = [
        {
            key: "visitDatetime",
            label: "Visit Date",
            render: (value: string | Date) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(value)}
                </div>
            ),
        },
        {
            key: "pet_name",
            label: "Pet",
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    {value}
                </div>
            ),
        },
        {
            key: "chiefComplaint",
            label: "Reason for Visit",
            render: (value: string) => (
                <div className="max-w-xs truncate" title={value}>
                    {value}
                </div>
            ),
        },
        {
            key: "prognosisNotes",
            label: "Diagnosis",
            render: (value: string) => (
                <div className="max-w-xs truncate" title={value}>
                    {value || <span className="text-muted-foreground">-</span>}
                </div>
            ),
        },
        {
            key: "veterinarianNotes",
            label: "Treatment",
            render: (value: string) => (
                <div className="max-w-xs truncate" title={value}>
                    {value || <span className="text-muted-foreground">-</span>}
                </div>
            ),
        },
    ]

    return (
        <DataTable
            title="Historial médico"
            description={`${records.length} historial médico${records.length !== 1 ? "s" : ""} ${filterStatus !== "all" ? `for selected pet` : ""}`}
            data={records}
            columns={columns}
            onAdd={canModify ? onAdd : undefined}
            onEdit={canModify ? onEdit : undefined}
            onDelete={canModify ? onDelete : undefined}
            searchPlaceholder="Buscar expedientes médicos..."
            addButtonText="Añadir historial médico"
        />
    )
}
