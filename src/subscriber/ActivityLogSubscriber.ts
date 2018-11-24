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
        // TODO: stephen see if we can get the columns that were impacted here
        let notes = entity.auditName() + "[" + entity.id +"] was inserted by " + entity.createdBy.email;
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
        // TODO: stephen see if we can get the columns that were impacted here
        // TODO: stephen see why the email is failing here sometimes to be found.
        let email = entity.lastUpdatedBy ? entity.lastUpdatedBy.email : "<createdBy missing>";
        let notes = entity.auditName() + "[" + entity.id +"] was updated by " + email;
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
        // TODO: stephen see if we can get the columns that were impacted here
        let notes = entity.auditName() + "[" + entity.id +"] was updated by " + user.email;
        return this.createLog("DELETE", notes, entity, event.manager.getRepository(ActivityLog), user);
    }

    // TODO: stephen need to figure out why we aren't logging these entities.
    async afterLoad(entity: IAuditedEntity) {
        this.debugLog("inside afterLoad");
        // for now we will skip SELECT statements on the fact that the SystemUser was viewed
        // it creates a circular cycle that blows up the server.
        // TODO: stephen figure out a way to handle the circular dependency here with SystemUser
        // we still want to see SELECT statements with SystemUser
        // if it's a proxy object it will just have the format of {id: <number>} which doesn't match the interface...
        // not sure why they don't hydrate a full object... seems wierd.
        if ((entity.auditName && entity.auditName() == "SystemUser") || this.shouldSkipEntity(entity)) {
            return;
        }
        let service = AuthService.getInstance();
        let user = service.getLoggedInSystemUser();
        let notes = entity.auditName() + "[" + entity.id +"] was viewed by " + user.email;
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
        // TODO: stephen is there a better way to handle this?
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