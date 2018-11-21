import { JoinColumn, ManyToOne, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { SystemUser } from "./SystemUser";
import { AuthService } from "../services/AuthService";

export abstract class AuditedEntity {

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

    @BeforeInsert()
    async __setCreationData()
    {
        let service = new AuthService();
        let user = await service.getLoggedInSystemUser();
        let date = new Date();
        this.setCreation(user, date);
        this.setLastUpdate(user, date);
    }

    @BeforeUpdate()
    async __setUpdateData()
    {
        let service = new AuthService();
        let user = await service.getLoggedInSystemUser();
        let date = new Date();
        this.setLastUpdate(user, date);
    }

    public setLastUpdate(updater:SystemUser, date:Date) {
        this.lastUpdatedBy = updater;
        this.lastUpdatedDate = date;
    }

    public setCreation(creator:SystemUser, date:Date) {
        this.createdBy = creator;
        this.creationDate = date;
    }
}