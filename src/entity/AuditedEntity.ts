import { JoinColumn, ManyToOne, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { SystemUser } from "./SystemUser";
import { AuthService } from "../services/AuthService";
import { IAuditedEntity } from "./IAuditedEntity";

export abstract class AuditedEntity implements IAuditedEntity {

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

    abstract id:number;
    abstract auditName() : string;
    abstract getEntityDescription() : string;

    @BeforeInsert()
    __setCreationData()
    {
        let user = AuthService.getInstance().getLoggedInSystemUser();
        let date = new Date();
        this.setCreation(user, date);
        this.setLastUpdate(user, date);
    }

    @BeforeUpdate()
    __setUpdateData()
    {
        let user = AuthService.getInstance().getLoggedInSystemUser();
        let date = new Date();
        this.setLastUpdate(user, date);
    }

    private setLastUpdate(updater:SystemUser, date:Date) {
        this.lastUpdatedBy = updater;
        this.lastUpdatedDate = date;
    }

    private setCreation(creator:SystemUser, date:Date) {
        this.createdBy = creator;
        this.creationDate = date;
    }
}