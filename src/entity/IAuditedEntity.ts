import { SystemUser } from "./SystemUser";

export interface IAuditedEntity {
    id: number;
    auditName() :string;
    getEntityDescription() : string;
    lastUpdatedBy :SystemUser;
    createdBy :SystemUser;
    creationDate : Date;
    lastUpdatedDate : Date;
}