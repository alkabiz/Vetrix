import { AppointmentRepository } from "@/lib/database/repositories/appointment-repository"
import { AppointmentDTO, UpdateAppointmentDTO } from "@/lib/api/types/appointment.types"
import { NotFoundError } from "@/lib/core/error-handler"

export class AppointmentService {
    static getById(id: number): AppointmentDTO {
        const appointment = AppointmentRepository.findByIdWithDetails(id)
        if (!appointment) {
            throw new NotFoundError("Appointment not found")
        }
        return this.mapToDTO(appointment)
    }

    static update(id: number, data: UpdateAppointmentDTO): AppointmentDTO {
        const updated = AppointmentRepository.update(id, data)
        if (!updated) {
            throw new NotFoundError("Appointment not found")
        }
        return this.getById(id) // Return with details
    }

    static delete(id: number): void {
        const deleted = AppointmentRepository.delete(id)
        if (!deleted) {
            throw new NotFoundError("Appointment not found")
        }
    }

    private static mapToDTO(entity: any): AppointmentDTO {
        return {
            id: entity.id,
            petId: entity.pet_id,
            ownerId: entity.owner_id,
            petName: entity.pet_name,
            ownerName: entity.owner_name,
            date: entity.appointment_date,
            time: entity.appointment_time,
            reason: entity.reason,
            status: entity.status,
            notes: entity.notes,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        }
    }
}
