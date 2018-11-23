import { ActivityLogDTO } from "./ActivityLogDTO";
import { AppointmentDTO } from "./AppointmentDTO";

export class TherapistDTO {
    id: number
    name: string
    appointments: AppointmentDTO[]
    logs: ActivityLogDTO[]
}