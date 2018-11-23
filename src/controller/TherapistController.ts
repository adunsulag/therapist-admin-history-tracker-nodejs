import {getRepository, Entity, getConnectionManager} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Therapist} from "../entity/Therapist";
import { ActivityLog } from "../entity/ActivityLog";
import { TherapistToDTO } from "../services/TherapistToDTO";
import { ActivityLogToDTO } from "../services/ActivityLogToDTO";

export class TherapistController {

    private repository = getRepository(Therapist);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.repository.find().then(therapists => therapists.map(t => TherapistToDTO.toDTO(t)));
    }

    async one(request: Request, response: Response, next: NextFunction) {
        let id = +request.params.id;
        if (isNaN(id)) {
            throw new Error("Invalid id");
        }
        return this.getEntityWithAppointmentsAndLogs(id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let name = request.body.name || "";
        if (!name) {
            throw new Error("name cannot be empty");
        }
        let id = +request.params.id;
        if (isNaN(id)) {
            throw new Error("Invalid id");
        }

        let entity = await this.repository.findOne(id);
        if (!entity) {
            return null;
        }

        console.log("Changing entity name from ", entity.name, " to ", name);
        entity.name = name;
        return this.repository.save(entity).then(entity => {
            return this.getEntityWithAppointmentsAndLogs(entity.id);
        });
    }

    async create(request: Request, response: Response, next: NextFunction) {
        let name = request.body.name || "";
        if (!name) {
            throw new Error("name cannot be empty");
        }
        let entity = new Therapist();
        entity.name = name;
        return this.repository.save(entity).then(entity => {
            return this.getEntityWithAppointmentsAndLogs(entity.id);
        });
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let id = +request.params.id;
        if (isNaN(id)) {
            throw new Error("Invalid id");
        }
        let entity = await this.repository.findOne(id);
        if (!entity) {
            // we want this to be idempotent.
            return {};
        }
        let removedEntity = await this.repository.remove(entity);
        console.log("Removed entity was ", removedEntity);
        return {};
    }

    private getEntityWithAppointmentsAndLogs(id:number) {
        let em = getConnectionManager().get().createEntityManager();
        // let repo = em.getRepository(Therapist);
      
        // TODO: stephen this operation is taking almost 6.5 seconds to complete!!! Need to optimize this.
        console.time("getTherapist");
        return em.createQueryBuilder()
        .select("therapist")
        .from(Therapist, "therapist")
        .leftJoinAndSelect("therapist.appointments", "appointment")
        .leftJoinAndSelect("appointment.client", "client")
        .where("therapist.id = :id ", {id : id})
        .getOne()
        .then(async (entity) => {
            if (!entity) {
                return entity;
            }
            console.timeEnd("getTherapist");
            console.time("getTherapistLogs");
            let logs = await em.getRepository(ActivityLog).find({relations: ["createdBy"], where: {tableName: "Therapist", tableId: id}});
            entity.logs = logs;
            console.timeEnd("getTherapistLogs");
            console.time("therapistToDTO");
            let dto = TherapistToDTO.toDTO(entity);
            console.timeEnd("therapistToDTO");
            return dto;
        });
    }

}