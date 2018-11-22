import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { AuditedEntity } from "./AuditedEntity";
import { Client } from "./Client";
import { Therapist } from "./Therapist";

@Entity()
export class Appointment extends AuditedEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    status:string;

    @Column()
    isActive : boolean = true;

    @JoinColumn()
    @ManyToOne(type => Client, client => client.appointments)
    client :Client;
    

    @JoinColumn()
    @ManyToOne(type => Therapist, therapist => therapist.appointments)
    therapist :Therapist;
    
    public auditName() : string {
        return "Appointment";
    }
}
