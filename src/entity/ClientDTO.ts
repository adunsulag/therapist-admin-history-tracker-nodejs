import { AppointmentDTO } from "./AppointmentDTO";
import { ActivityLogDTO } from "./ActivityLogDTO";

export class ClientDTO {
    id: number
    name: string
    appointments: AppointmentDTO[]
    logs: ActivityLogDTO[]
}