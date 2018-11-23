import {getRepository, Entity, getConnectionManager} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Appointment} from "../entity/Appointment";
import { AuthService } from "../services/AuthService";
import { Client } from "../entity/Client";
import * as moment from "moment";
import { Therapist } from "../entity/Therapist";

export class AppointmentController {

    private repository = getRepository(Appointment);
    private connectionManager = getConnectionManager();
    async all(request: Request, response: Response, next: NextFunction) {
        return this.repository.find({relations: ["client", "therapist"]}).then(appts => appts.map(a => this.toDTO(a)));
    }

    async one(request: Request, response: Response, next: NextFunction) {
        let id = +request.params.id;
        if (isNaN(id)) {
            throw new Error("Invalid id");
        }
        return this.repository.findOne(id, {relations: ["client", "therapist"]}).then(appt => this.toDTO(appt));
    }

    private toDTO(appt:Appointment) {
        return {
            id: appt.id
            ,clientID: appt.client.id
            ,clientName: appt.client.name
            ,therapistID: appt.therapist.id
            ,therapistName: appt.therapist.name
            ,startDate: appt.startDate
            ,endDate: appt.endDate
        };
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let em = this.connectionManager.get().createEntityManager();
        let id = +request.params.id;
        if (isNaN(id)) {
            throw new Error("Invalid id");
        }

        let entity = await em.getRepository(Appointment).findOne(id);
        if (!entity) {
            return null;
        }

        let clientID = +request.body.clientID;
        let therapistID = +request.body.therapistID;
        let startDate = moment(request.body.startDate, 'YYYY-MM-DD hh:mm');
        let endDate = moment(request.body.endDate, 'YYYY-MM-DD hh:mm');
        let status = request.body.status;

        if (isNaN(clientID) || isNaN(therapistID) || startDate.isAfter(endDate) || startDate.isBefore(moment().subtract(10, 'years'))) {
            throw new Error("Invalid parameters");
        }

       
        let client = await em.getRepository(Client).findOne(clientID);
        if (!client) {
            throw new Error("Invalid clientID");
        }
        
        let therapist = await em.getRepository(Therapist).findOne(therapistID);
        if (!therapist) {
            throw new Error("Invalid therapistID");
        }
       
        if (!['Pending', 'NoShow', 'Canceled', 'Completed'].find(s => s == status)) {
            throw new Error("Invalid status");
        }

        Object.assign(entity, {client: client, therapist: therapist, startDate: startDate, endDate: endDate, status: status});
        return this.repository.save(entity).then(entity => this.toDTO(entity));
    }

    async create(request: Request, response: Response, next: NextFunction) {
        let entity = new Appointment();
        if (!entity) {
            return null;
        }
        
        let clientID = +request.body.clientID;
        let therapistID = +request.body.therapistID;
        let startDate = moment(request.body.startDate, 'YYYY-MM-DD hh:mm');
        let endDate = moment(request.body.endDate, 'YYYY-MM-DD hh:mm');
        let status = request.body.status;

        if (isNaN(clientID) || isNaN(therapistID) || startDate.isAfter(endDate) || startDate.isBefore(moment().subtract(10, 'years'))) {
            throw new Error("Invalid parameters");
        }

        let em = this.connectionManager.get().createEntityManager();
        let client = await em.getRepository(Client).findOne(clientID);
        if (!client) {
            throw new Error("Invalid clientID");
        }
        
        let therapist = await em.getRepository(Therapist).findOne(therapistID);
        if (!therapist) {
            throw new Error("Invalid therapistID");
        }
       
        if (!['Pending', 'NoShow', 'Canceled', 'Completed'].find(s => s == status)) {
            throw new Error("Invalid status");
        }

        Object.assign(entity, {client: client, therapist: therapist, startDate: startDate, endDate: endDate, status: status});
        return this.repository.save(entity).then(entity => this.toDTO(entity));
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
}