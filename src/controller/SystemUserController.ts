import {getRepository} from "typeorm";
import {NextFunction, Response} from "express";
import {SystemUser} from "../entity/SystemUser";
import { ClientResponse } from "http";
import { Request } from "../types/request";
import { AuthService } from "../services/AuthService";

export class SystemUserController {

    private userRepository = getRepository(SystemUser);

    async login(request: Request, response: Response, next: NextFunction) {

        let payload = request.body.payload || {};
        let email =  payload.email;
        let eventID = payload.event_id;

        if (!email) {
            throw new Error("Email parameter is missing");
        }
        if (!eventID) {
            throw new Error("Invalid event_id");
        }

        let user = await this.userRepository.findOne({where: {identityId: eventID}});
        let userId;
        if (!user) {
            // need to create the user from the amazon identity service
            // TODO: stephen need to verify the AWS payload came from Amazon.
            user = new SystemUser();
            user.identityId = eventID;
            user.createdBy =  request.applicationUser;
            user.creationDate = new Date();
            user.lastUpdatedBy = user.createdBy;
            user.lastUpdatedDate = user.creationDate;
            user.email = email;
            let updatedUser = await this.userRepository.save(user);
            userId = updatedUser.id;
        }
        else {
            userId = user.id;
        }
        AuthService.getInstance().setLoggedInUser(user);
        request.session['loggedIn'] = true;
        request.session['systemUserId'] = userId;
        // need to stuff everything into the session

        return {id: userId};

    }

    async logout(request: Request, response: Response, next: NextFunction) {
        delete request.session['loggedIn'];
        delete request.session['systemUserId'];
        request.loggedInUser = null;
        AuthService.getInstance().clear();
        return new Promise((resolve, reject) => {
            request.session.destroy((error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve({});
                }
            });
        });
    }
}