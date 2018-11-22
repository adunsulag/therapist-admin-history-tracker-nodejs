import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { AuditedEntity } from "./AuditedEntity";

@Entity()
export class Therapist extends AuditedEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive : boolean;

    public auditName() : string {
        return "Therapist";
    }
}
