import {getRepository, Entity} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Therapist} from "../entity/Therapist";
import { AuthService } from "../services/AuthService";

export class TherapistController {

    private repository = getRepository(Therapist);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.repository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        let id = +request.params.id;
        if (isNaN(id)) {
            throw new Error("Invalid id");
        }
        return this.repository.findOne(id);
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
        return this.repository.save(entity);
    }

    async create(request: Request, response: Response, next: NextFunction) {
        let name = request.body.name || "";
        if (!name) {
            throw new Error("name cannot be empty");
        }
        let entity = new Therapist();
        entity.name = name;
        return this.repository.save(entity);
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