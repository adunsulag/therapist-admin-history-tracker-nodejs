import {getRepository, Entity, getConnectionManager} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { ActivityLog } from "../entity/ActivityLog";
import { ActivityLogToDTO } from "../services/ActivityLogToDTO";

export class ActivityLogController {

    private repository = getRepository(ActivityLog);

    async all(request: Request, response: Response, next: NextFunction) {
        let entity = request.query.entity || "";
        let entityID = request.query.entityID ? +request.query.entityID : null;
        let action = request.query.action || "";
        console.log(request.query);
        
        if (entity && !(["SystemUser", "Therapist", "Client", "Appointment"].find(t => t == entity))) {
            throw new Error("Invalid Entity");
        }
        if (action && !(["SELECT", "UPDATE", "DELETE", "INSERT"].find(t => t == action))) {
            throw new Error("Invalid action");
        }
        if (entityID && isNaN(entityID)) {
            throw new Error("Invalid entityID");
        }
        let findPromise;

        if (entity || action || entityID) {
            let whereClause:{tableName?:string, action?:string, tableId?:number} = {};
            if (entity) {
                whereClause.tableName = entity;
            }
            if (action) {
                whereClause.action = action;
            }
            if (entityID) {
                whereClause.tableId = entityID;
            }
            console.log("Searching with ", whereClause);
            findPromise = this.repository.find({where: whereClause, order: {createdBy: "DESC"}, relations: ["createdBy"]});
        }
        else {
            findPromise = this.repository.find({relations: ["createdBy"], order: {createdBy: "DESC"}});
        }

        // translate it to the API the frontend is expecting.
        return findPromise.then((logs) => {
            return logs.map((l) => {
                return ActivityLogToDTO.toDTO(l);
            });
        });
    }
}