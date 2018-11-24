import * as Express from "express";
import { SystemUser } from "../entity/SystemUser";

export interface Request extends Express.Request {
	applicationUser: SystemUser;
	loggedInUser: SystemUser;
}