import { EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent, RemoveEvent, getRepository } from "typeorm";
import { AuthService } from "../services/AuthService";
import { ActivityLog } from "../entity/ActivityLog";
import { IAuditedEntity } from "../entity/IAuditedEntity";
import { Client } from "../entity/Client";
import { SystemUser } from "../entity/SystemUser";

@EventSubscriber()
export class ActivityLogSubscriber implements EntitySubscriberInterface {
    // private authService = new AuthService();

    /**
     * Called before entity insertion.
     */
    async afterInsert(event: InsertEvent<any>) {
        console.log("inside afterInsert");
        if (this.shouldSkipEntity(event.entity)) {
            return;
        }
        let entity:IAuditedEntity = event.entity;
        // TODO: stephen see if we can get the columns that were impacted here
        let notes = entity.auditName() + "[" + entity.id +"] was inserted by " + entity.createdBy.email;
        return this.createLog("INSERT", notes, entity, event.manager.getRepository(ActivityLog));
    }

    async beforeUpdate(event: UpdateEvent<any>) {
        console.log("inside beforeUpdate");
        return Promise.resolve();
    }

    /**
     * Called before entity insertion.
     */
    async afterUpdate(event: UpdateEvent<any>) {
        console.log("inside afterUpdate");
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
        console.log("inside beforeRemove");
        if (this.shouldSkipEntity(event.entity)) {
            return;
        }
        let user = await (new AuthService()).getLoggedInSystemUser();
        let entity:IAuditedEntity = event.entity;
        // TODO: stephen see if we can get the columns that were impacted here
        let notes = entity.auditName() + "[" + entity.id +"] was updated by " + user.email;
        return this.createLog("DELETE", notes, entity, event.manager.getRepository(ActivityLog), user);
    }

    async afterLoad(event: any) {
        console.log("inside afterLoad");
        if (this.shouldSkipEntity(event.entity)) {
            return;
        }
        let entity:IAuditedEntity = event.entity;
        let user = await (new AuthService()).getLoggedInSystemUser();
        let notes = entity.auditName() + "[" + entity.id +"] was updated by " + user.email;
        return this.createLog("SELECT", notes, entity, event.manager.getRepository(ActivityLog), user);
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
        console.log("skipping over entity");
        // TODO: stephen is there a better way to handle this?
        if (!(entity && entity.auditName)) {
            return true;
        }
        else if (entity.hasOwnProperty('tableName') 
        || entity.hasOwnProperty('tableId')) {
            return true;
        }

        return false;
    }
    

}