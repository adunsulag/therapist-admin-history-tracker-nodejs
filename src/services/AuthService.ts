import { getRepository } from "typeorm";
import { SystemUser } from "../entity/SystemUser";
import { Request } from "../types/request";
import { userInfo } from "os";

export class AuthService {
    private repository = getRepository(SystemUser);
    private request:Request;
    private appUser:SystemUser;
    private loggedInUser:SystemUser;
    static $instance:AuthService;

    constructor() {
    }

    // TODO: stephen I don't like the singleton here... but without a DI container I'm going to use this pattern
    // TODO: stephen change this out if we decide to incorporate a DI system.
    static getInstance() {
       return AuthService.$instance;
    }
    static async buildOrGetInstance(req:Request) : Promise<AuthService> {
        if (AuthService.$instance) {
            return Promise.resolve(AuthService.$instance);
        }
        AuthService.$instance = new AuthService();
        await AuthService.$instance.init(req);
        return AuthService.$instance;
    }

    async init(request:Request) : Promise<{appUser: SystemUser, loggedInUser: SystemUser|null}> {
        // if we are logged in
        // if we have no user, load the user
        // if the user id is not the same, reload the user id
        // if the user id is the same, do nothing
        // if we are not logged in
        //      set the user to be null
        // if the app user is not loaded
        //      load the app user
        if (request.session['loggedIn'] === true) {
            let userId = request.session['systemUserId'];
            if (this.loggedInUser == null
                || this.loggedInUser.id != userId) {
                this.setLoggedInUser(await this.repository.findOne(userId));
            }
        }
        else {
            this.clear();
        }
        
        if (this.appUser == null) {
            this.appUser = this.createApplicationSystemUser();
        }
        return Promise.resolve({appUser: this.appUser, loggedInUser: this.loggedInUser});
    }

    setLoggedInUser(user:SystemUser) {
        this.loggedInUser = user;
    }

    clear() {
        this.loggedInUser = null;
    }

    getLoggedInSystemUser() {
        return this.loggedInUser;
    }

    getApplicationSystemUser() {
        return this.appUser;
    }

    private createApplicationSystemUser() {
        let createdBy = new SystemUser();
        createdBy.id = 1;

        let appUser = new SystemUser();
        appUser.id = 1;
        appUser.email = "stephen@nielson.org";
        appUser.active = true;
        appUser.createdBy = createdBy;
        appUser.creationDate = new Date();
        appUser.lastUpdatedBy = createdBy;
        appUser.lastUpdatedDate = new Date();
        return appUser;
    }
}