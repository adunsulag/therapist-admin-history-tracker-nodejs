import "reflect-metadata";
import {createConnection, getConnectionOptions} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Response} from "express";
import {Request} from "./types/request";
import {Routes} from "./routes";
import {SystemUser} from "./entity/SystemUser";
import * as ExpressSession from "express-session";
import { AuthService } from "./services/AuthService";
import { request } from "https";
import { ClientResponse } from "http";

const DEBUG_SESSION = false;


getConnectionOptions().then(async options => {
	//options.extra = {ssl: true };

	createConnection(options).then(async connection => {
		
	    // create express app
		const app = express();
		app.use(ExpressSession({secret: "random-therapist-admin-app-secret-key", resave: false, saveUninitialized: true}));
		app.use(bodyParser.json());
		app.use((req: Request, res: Response, next: Function) => {
			console.log("Handling request: ", req.path);
			next();
		});
		app.use(async (req: Request, res: Response, next: Function) => {
			if (DEBUG_SESSION) {
				console.log("session ", req.session);
			}
			let instance = await AuthService.buildOrGetInstance(req);
			req.applicationUser = instance.getApplicationSystemUser();
			req.loggedInUser = instance.getLoggedInSystemUser();
			if (DEBUG_SESSION) {
				console.log("applicationUser: ", req.applicationUser);
				console.log("loggedInUser: ", req.loggedInUser);
			}
			next();
		});
	    // register express routes from defined application routes
	    Routes.forEach(route => {
		(app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
			let result;
			if (route.isOpen === true || req.loggedInUser) {
				result = (new (route.controller as any))[route.action](req, res, next);

				if (result instanceof Promise) {
					result.then(result => {
						if (result !== null && result !== undefined) {
							res.send(result);
						}
						else {
							res.status(404);
							res.json({error: 'Result was not found'});
						}
					})
					.catch((error) => {
						console.error(error);
						res.status(500);
						res.json({error: error.message});
					});
				} else if (result !== null && result !== undefined) {
					res.json(result);
				}
			}
			else if (!req.loggedInUser) {
				res.status(403); // forbidden
				res.json({error: "You must be logged in to access this resouce"});
			}
		});
	    });

	    // setup express app here
	    // ...

		// start express server
		let port = process.env.PORT || 3000;
		app.listen(port);
		console.log("Listening on port ", port);

		// insert new users for test
		let systemUser = Object.assign(new SystemUser(), {id: 1, email: 'stephen@nielson.org'});
		let currentDate = new Date();
	    // await connection.manager.save(connection.manager.create(SystemUser, {
		// 	id: 1
		// 	,identityId: ''
		// 	,email: 'stephen@nielson.org'
		// 	,lastUpdatedBy: systemUser
		// 	,createdBy: systemUser
		// 	,lastUpdatedDate: currentDate
		// 	,creationDate: currentDate
	    // }));
		
		// await connection.manager.save(connection.manager.create(Client, {
		// 	name: "Test Client 1"
		// }));

		// await connection.manager.save(connection.manager.create(Client, {
		// 	name: "Test Client 2"
		// }));
	});

}).catch(error => console.log(error));
