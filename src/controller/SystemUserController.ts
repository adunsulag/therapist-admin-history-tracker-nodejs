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
        let subjectId = payload.sub;

        if (!email) {
            throw new Error("Email parameter is missing");
        }
        if (!subjectId) {
            throw new Error("Invalid sub");
        }

        // need to verify the jwtToken
        return AuthService.getInstance().verifyPayload(payload, request.body.jwtToken)
        .then(async (success) => {
            console.log("Attempting to find user");
            let user = await this.userRepository.findOne({where: {identityId: subjectId}});
            let userId;
            if (!user) {
                console.log("Did not find user, creating account");
                user = new SystemUser();
                user.identityId = subjectId;
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
            console.log("Logging in user");
            AuthService.getInstance().setLoggedInUser(user);
            request.session['loggedIn'] = true;
            request.session['systemUserId'] = userId;

            console.log("Returning user id: ", userId);
            return {id: userId};
        })
        .catch((error) => {
            console.error("Failed to veify payload for request");
            throw error;
        });
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