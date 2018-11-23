import {getRepository, Entity, getConnectionManager} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Client} from "../entity/Client";
import { AuthService } from "../services/AuthService";
import { ClientToDTO } from "../services/ClientToDTO";
import { ActivityLog } from "../entity/ActivityLog";

export class ClientController {

    private repository = getRepository(Client);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.repository.find().then(clients => clients.map(t => ClientToDTO.toDTO(t)));
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
        return this.repository.save(entity).then(client => {
            return this.getEntityWithAppointmentsAndLogs(entity.id);
        });
    }

    async create(request: Request, response: Response, next: NextFunction) {
        let name = request.body.name || "";
        if (!name) {
            throw new Error("name cannot be empty");
        }
       
        console.log("Create entity with ", name);
        let entity = new Client();
        entity.name = name;
        return this.repository.save(entity).then(client => {
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
        console.time("getClient");
        return em.createQueryBuilder()
        .select("client")
        .from(Client, "client")
        .leftJoinAndSelect("client.appointments", "appointment")
        .leftJoinAndSelect("appointment.therapist", "therapist")
        .where("client.id = :id ", {id : id})
        .getOne()
        .then(async (entity) => {
            if (!entity) {
                return entity;
            }
            console.log(entity);

            console.timeEnd("getClient");
            console.time("getClientLogs");
            let logs = await em.getRepository(ActivityLog).find({relations: ["createdBy"], where: {tableName: "Client", tableId: id}});
            entity.logs = logs;
            console.timeEnd("getClientLogs");
            console.time("clientToDTO");
            let dto = ClientToDTO.toDTO(entity);
            console.timeEnd("clientToDTO");
            return dto;
        });
    }
    
}