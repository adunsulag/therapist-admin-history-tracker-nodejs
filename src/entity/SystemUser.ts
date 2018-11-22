import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne} from "typeorm";
import { IAuditedEntity } from "./IAuditedEntity";

@Entity()
export class SystemUser implements IAuditedEntity {
   
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    identityId: string;

    @Column()
    email: string;

    @Column()
    active: boolean = true;

    // we can't use audited entity because we refer to ourselves... the tools aren't working well on this.
    @JoinColumn()
    @ManyToOne(type => SystemUser, nullable => false)
    lastUpdatedBy :SystemUser;

    @JoinColumn()
    @ManyToOne(type => SystemUser, nullable => false)
    createdBy :SystemUser;

    @Column()
    creationDate : Date;

    @Column()
    lastUpdatedDate : Date;

    auditName(): string {
        return "SystemUser";
    }
    

}
