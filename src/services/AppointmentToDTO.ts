import { Appointment } from "../entity/Appointment";
import { AppointmentDTO } from "../entity/AppointmentDTO";

export class AppointmentToDTO {
    static toDTO(appt:Appointment) : AppointmentDTO {
        return {
            id: appt.id
            ,clientID: appt.client.id
            ,clientName: appt.client.name
            ,therapistID: appt.therapist.id
            ,therapistName: appt.therapist.name
            ,startDate: appt.startDate
            ,endDate: appt.endDate
        };
    }
}