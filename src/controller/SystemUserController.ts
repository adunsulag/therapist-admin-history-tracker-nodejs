import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {SystemUser} from "../entity/SystemUser";
import { ClientResponse } from "http";

export class SystemUserController {

    private userRepository = getRepository(SystemUser);

    async login(request: Request, response: ClientResponse, next: NextFunction) {

    }

    async logout(request: Request, response: ClientResponse, next: NextFunction) {
        
    }
}