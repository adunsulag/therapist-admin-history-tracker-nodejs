import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent, getRepository } from "typeorm";
import { AuthService } from "../services/AuthService";
import { ActivityLog } from "../entity/ActivityLog";
import { IAuditedEntity } from "../entity/IAuditedEntity";
import { Client } from "../entity/Client";
import { SystemUser } from "../entity/SystemUser";

@EventSubscriber()
export class ActivityLogSubscriber implements EntitySubscriberInterface {
    private DEBUG:boolean = false;

    private debugLog(msg:string) {
        if (this.DEBUG) {
            console.log(msg);
        }
    }
    
    /**
     * Called before entity insertion.
     */
    async afterInsert(event: InsertEvent<any>) {
        this.debugLog("inside afterInsert");
        if (this.shouldSkipEntity(event.entity)) {
            return;
        }
        let entity:IAuditedEntity = event.entity;
        let notes = entity.getEntityDescription() + " was inserted by " + entity.createdBy.getEntityDescription();
        return this.createLog("INSERT", notes, entity, event.manager.getRepository(ActivityLog));
    }

    async beforeUpdate(event: UpdateEvent<any>) {
        this.debugLog("inside beforeUpdate");
        return Promise.resolve();
    }

    /**
     * Called before entity insertion.
     */
    async afterUpdate(event: UpdateEvent<any>) {
        this.debugLog("inside afterUpdate");
        if (this.shouldSkipEntity(event.entity)) {
            return;
        }
        let entity:IAuditedEntity = event.entity;
        let lastUpdatedBy = entity.lastUpdatedBy ? entity.lastUpdatedBy.getEntityDescription() : "<lastUpdatedBy missing>";
        let notes = entity.getEntityDescription() + " was updated by " + lastUpdatedBy;
        return this.createLog("UPDATE", notes, entity, event.manager.getRepository(ActivityLog));
    }

    async beforeRemove(event: RemoveEvent<any>) {
        this.debugLog("inside beforeRemove");
        if (this.shouldSkipEntity(event.entity)) {
            return;
        }
        let service = AuthService.getInstance();
        let user = service.getLoggedInSystemUser();
        let entity:IAuditedEntity = event.entity;
        let notes = entity.getEntityDescription() + " was updated by " + user.getEntityDescription();
        return this.createLog("DELETE", notes, entity, event.manager.getRepository(ActivityLog), user);
    }

    async afterLoad(entity: IAuditedEntity) {
        this.debugLog("inside afterLoad");
        // for now we will skip SELECT statements on the fact that the SystemUser was viewed
        // it creates a circular cycle that blows up the server.
        if ((entity.auditName && entity.auditName() == "SystemUser") || this.shouldSkipEntity(entity)) {
            return;
        }
        let service = AuthService.getInstance();
        let user = service.getLoggedInSystemUser();
        let notes = entity.getEntityDescription() + " was viewed by " + user.getEntityDescription();
        return this.createLog("SELECT", notes, entity, getRepository(ActivityLog), user);
    }

    private createLog(action, notes, entity:IAuditedEntity, repo:any, actionUser?:SystemUser) {
        let log = new ActivityLog();
        log.createdBy = actionUser || entity.lastUpdatedBy;
        log.creationDate = entity.lastUpdatedDate;
        log.tableName = entity.auditName();
        log.tableId = entity.id;
        log.action = action;
        log.notes = notes;
        return repo.save(log);
    }

    private shouldSkipEntity(entity:any) {
        if (!(entity && entity.auditName)) {
            this.debugLog("skipping over entity");
            return true;
        }
        else if (entity.hasOwnProperty('tableName') 
        || entity.hasOwnProperty('tableId')) {
            this.debugLog("skipping over entity");
            return true;
        }

        this.debugLog("not skipping over entity");
        return false;
    }
    

}