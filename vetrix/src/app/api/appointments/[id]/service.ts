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
            appointmentNumber: entity.appointment_number,
            petId: entity.pet_id,
            ownerId: entity.owner_id,
            veterinarianId: entity.veterinarian_id ?? null,
            petName: entity.pet_name,
            ownerName: entity.owner_name,
            veterinarianName: entity.veterinarian_name,
            date: entity.appointment_date,
            time: entity.appointment_time,
            appointmentDatetime: entity.appointment_datetime,
            durationMinutes: entity.duration_minutes,
            reason: entity.reason,
            status: entity.status,
            statusId: entity.status_id,
            typeId: entity.type_id,
            priorityId: entity.priority_id,
            notes: entity.notes ?? null,
            internalNotes: entity.internal_notes ?? null,
            isFollowUp: entity.is_follow_up,
            parentAppointmentId: entity.parent_appointment_id ?? null,
            petConditionOnArrival: entity.pet_condition_on_arrival ?? null,
            reminderSent: entity.reminder_sent,
            confirmationRequired: entity.confirmation_required,
            isConfirmed: entity.is_confirmed,
            followUpRequired: entity.follow_up_required,
            followUpDate: entity.follow_up_date ?? null,
            followUpReason: entity.follow_up_reason ?? null,
            estimatedCost: entity.estimated_cost ?? null,
            actualCost: entity.actual_cost ?? null,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        }
    }
}
