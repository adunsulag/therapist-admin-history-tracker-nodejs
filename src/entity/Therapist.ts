import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany} from "typeorm";
import { AuditedEntity } from "./AuditedEntity";
import { Appointment } from "./Appointment";

@Entity()
export class Therapist extends AuditedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive : boolean = true;

    @JoinColumn()
    @OneToMany(type => Appointment, appointment => appointment.client)
    appointments :Appointment[];

    public auditName() : string {
        return "Therapist";
    }
}
