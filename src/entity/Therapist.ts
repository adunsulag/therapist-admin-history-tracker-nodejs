import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany} from "typeorm";
import { AuditedEntity } from "./AuditedEntity";
import { Appointment } from "./Appointment";
import { ActivityLog } from "./ActivityLog";

@Entity()
export class Therapist extends AuditedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive : boolean = true;

    @JoinColumn()
    @OneToMany(type => Appointment, appointment => appointment.therapist)
    appointments :Appointment[];

    /**
     * These are populated dynamically
     */
    logs:ActivityLog[];

    public auditName() : string {
        return "Therapist";
    }

    public getEntityDescription() : string {
        let description = "Therapist[id=" + this.id + ",isActive=" + this.isActive;
        if (this.appointments && this.appointments.length) {
            description += ",appointments=[" + this.appointments.map(a => a.id).join(",") + "]";
        }
        if (this.name) {
            description += ",name=" + this.name;
        }
        return description + "]";
    }
}
