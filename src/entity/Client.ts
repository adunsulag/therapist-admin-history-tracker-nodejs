import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from "typeorm";
import { SystemUser } from "./SystemUser";
import { AuditedEntity } from "./AuditedEntity";
import { Appointment } from "./Appointment";
import { ActivityLog } from "./ActivityLog";

@Entity()
export class Client extends AuditedEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive : boolean = true;

    @JoinColumn()
    @OneToMany(type => Appointment, appointment => appointment.client)
    appointments :Appointment[];

     /**
     * These are populated dynamically
     */
    logs:ActivityLog[];
    
    public auditName() : string {
        return "Client";
    }

    public getEntityDescription() : string {
        let description = "Client[id=" + this.id + ",isActive=" + this.isActive;
        if (this.appointments && this.appointments.length) {
            description += ",appointments=[" + this.appointments.map(a => a.id).join(",") + "]";
        }
        if (this.name) {
            description += ",name=" + this.name;
        }
        return description + "]";
    }
}
