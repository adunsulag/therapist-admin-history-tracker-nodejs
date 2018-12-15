import { getRepository } from "typeorm";
import { SystemUser } from "../entity/SystemUser";
import { Request } from "../types/request";
import { userInfo } from "os";

import * as https from 'https';
import * as jose from 'node-jose';

export class AuthService {
    private repository = getRepository(SystemUser);
    private request:Request;
    private appUser:SystemUser;
    private loggedInUser:SystemUser;
    static $instance:AuthService;
    static REGION = 'us-east-1';
    static USERPOOL_ID = 'us-east-1_s9iDqPquj';
    static APP_CLIENT_ID = '1271f4r7a3f24kk53j6emll9nb';
    static KEYS_URL = 'https://cognito-idp.' + AuthService.REGION + '.amazonaws.com/' 
    + AuthService.USERPOOL_ID + '/.well-known/jwks.json';

    constructor() {
    }

    // We use the singleton here... but without a DI container I'm going to use this pattern
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

    async verifyPayload(claims:any, token:string) {
        return new Promise((resolve, reject) => {
            console.log("Attempting to verify token: ", token)
            var sections = token.split('.');
            // get the kid from the headers prior to verification
            var header = jose.util.base64url.decode(sections[0]);
            header = JSON.parse(header);
            var kid = header.kid;
            // download the public keys
            https.get(AuthService.KEYS_URL, function(response) {
                if (response.statusCode == 200) {
                    response.on('data', function(body:any) {
                        var keys = JSON.parse(body)['keys'];
                        // search for the kid in the downloaded public keys
                        var key_index = -1;
                        for (var i=0; i < keys.length; i++) {
                                if (kid == keys[i].kid) {
                                    key_index = i;
                                    break;
                                }
                        }
                        if (key_index == -1) {
                            console.log('Public key not found in jwks.json');
                            reject(new Error('Public key not found in jwks.json'));
                        }
                        // construct the public key
                        jose.JWK.asKey(keys[key_index]).
                        then(function(result) {
                            // verify the signature
                            jose.JWS.createVerify(result).
                            verify(token).
                            then(function(result) {
                                // now we can use the claims
                                // additionally we can verify the token expiration
                                var current_ts = Math.floor(new Date().getTime() / 1000);
                                if (current_ts > claims.exp) {
                                    reject(new Error('Token is expired'));
                                }
                                // and the Audience (use claims.client_id if verifying an access token)
                                if (claims.aud != AuthService.APP_CLIENT_ID) {
                                    reject(new Error('Token was not issued for this audience'));
                                }
                                console.log("Token was valid.  Return auth result");
                                resolve(claims);
                                // callback(null, claims);
                            }).
                            catch(function() {
                                reject(new Error('Signature verification failed'));
                            });
                        });
                    });
                }
            });
        });
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