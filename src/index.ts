import "reflect-metadata";
import {createConnection, getConnectionOptions} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {SystemUser} from "./entity/SystemUser";
import { Client } from "./entity/Client";


getConnectionOptions().then(async options => {
	//options.extra = {ssl: true };

	createConnection(options).then(async connection => {

	    // create express app
	    const app = express();
	    app.use(bodyParser.json());

	    // register express routes from defined application routes
	    Routes.forEach(route => {
		(app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
		    const result = (new (route.controller as any))[route.action](req, res, next);
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
		});
	    });

	    // setup express app here
	    // ...

	    // start express server
	    app.listen(3000);

		// insert new users for test
		let systemUser = Object.assign(new SystemUser(), {id: 1, email: 'stephen@nielson.org'});
		let currentDate = new Date();
	    await connection.manager.save(connection.manager.create(SystemUser, {
			id: 1
			,identityId: ''
			,email: 'stephen@nielson.org'
			,lastUpdatedBy: systemUser
			,createdBy: systemUser
			,lastUpdatedDate: currentDate
			,creationDate: currentDate
	    }));
		
		await connection.manager.save(connection.manager.create(Client, {
			name: "Test Client 1"
		}));

		await connection.manager.save(connection.manager.create(Client, {
			name: "Test Client 2"
		}));

	    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");
	});

}).catch(error => console.log(error));
