import { ActivityLogToDTO } from "./ActivityLogToDTO";
import { AppointmentToDTO } from "./AppointmentToDTO";
import { Client } from "../entity/Client";

export class ClientToDTO {
    static toDTO(c:Client) : ClientToDTO {
        let logs = c.logs ? c.logs.map(l => ActivityLogToDTO.toDTO(l)) : [];
        // populate the client if its not set
        let appointments = [];
        if (c.appointments) {
            c.appointments.forEach(a => a.client = c);
            appointments = c.appointments.map(a => AppointmentToDTO.toDTO(a));
        }
        return {
            id: c.id
            ,name: c.name
            ,appointments: appointments
            ,logs: logs
        };
    }
}