import { Therapist } from "../entity/Therapist";
import { TherapistDTO } from "../entity/TherapistDTO";
import { ActivityLogToDTO } from "./ActivityLogToDTO";
import { AppointmentToDTO } from "./AppointmentToDTO";

export class TherapistToDTO {
    static toDTO(t:Therapist) : TherapistDTO {
        let logs = t.logs ? t.logs.map(l => ActivityLogToDTO.toDTO(l)) : [];
        // make sure the appointments have our therapist relation populated...
        let appointments = [];
        if (t.appointments) {
            t.appointments.forEach(a => a.therapist = t);
            appointments = t.appointments.map(a => AppointmentToDTO.toDTO(a));
        }
        return {
            id: t.id
            ,name: t.name
            ,appointments: appointments
            ,logs: logs
        };
    }
}