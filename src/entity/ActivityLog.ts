import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, BeforeInsert} from "typeorm";
import { SystemUser } from "./SystemUser";
import { AuditedEntity } from "./AuditedEntity";

@Entity()
export class ActivityLog {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tableName: string;

    @Column()
    tableId: number;

    @Column()
    action: string;

    @Column()
    notes: string;

    @Column()
    isActive : boolean = true;

    @JoinColumn()
    @ManyToOne(type => SystemUser, nullable => false)
    createdBy :SystemUser;

    @Column()
    creationDate : Date;

    @BeforeInsert()
    async __setCreationData()
    {
        let date = new Date();
        this.creationDate = date;
    }
}
