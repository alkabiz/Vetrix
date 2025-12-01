import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Stethoscope } from "lucide-react"
import { MedicalRecordDTO } from "@/lib/api/types/medical-record.types"

interface MedicalRecordsStatsProps {
    records: MedicalRecordDTO[]
}

export function MedicalRecordsStats({ records }: MedicalRecordsStatsProps) {
    const stats = {
        total: records.length,
        thisMonth: records.filter((r) => {
            const recordDate = new Date(r.visitDatetime)
            const now = new Date()
            return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear()
        }).length,
        uniquePets: new Set(records.map((r) => r.petId)).size,
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de registros</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Todos los expedientes médicos</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Este mes</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.thisMonth}</div>
                    <p className="text-xs text-muted-foreground">Registros de este mes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mascotas únicas</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.uniquePets}</div>
                    <p className="text-xs text-muted-foreground">Mascotas con antecedentes</p>
                </CardContent>
            </Card>
        </div>
    )
}
