import { getRepository } from "typeorm";
import { SystemUser } from "../entity/SystemUser";

export class AuthService {
    private repository = getRepository(SystemUser);

    getLoggedInSystemUser() {
        // TODO: stephen need to deal with the session here
        return this.getApplicationSystemUser();
    }

    getApplicationSystemUser() {
        return this.repository.findOne(1);
    }
}