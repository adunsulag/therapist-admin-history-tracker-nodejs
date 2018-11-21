import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { SystemUser } from "./SystemUser";
import { AuditedEntity } from "./AuditedEntity";

@Entity()
export class Client extends AuditedEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive : boolean = true;
}
