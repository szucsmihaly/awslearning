import { Injectable } from "@angular/core";
import { CognitoUser, ICognitoUserData, CognitoUserPool, ICognitoUserPoolData, AuthenticationDetails, IAuthenticationDetailsData, CognitoUserSession, CognitoIdToken, CognitoUserAttribute, ICognitoUserAttributeData, ISignUpResult } from "amazon-cognito-identity-js";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

@Injectable()
export class UserService {

    ClientId: string = "2k1p155h8fp9cntto7bgfigvts";
    UserPoolId: string = "us-east-2_SndkXWg7y";

    userPoolData: ICognitoUserPoolData = null;
    userPool: CognitoUserPool = null;

    constructor() {

        this.userPoolData = {
            ClientId: this.ClientId,
            UserPoolId: this.UserPoolId
        }

        this.userPool = new CognitoUserPool(this.userPoolData);

    }

    login(username: string, password: string): Observable<any> {

        console.log("User Service - Login");

        let cognitoUserData: ICognitoUserData = {
            Username: username,
            Pool: this.userPool
        }

        let cognitoUser: CognitoUser = new CognitoUser(cognitoUserData);

        let authenticationDefailsData: IAuthenticationDetailsData = {
            Username: username,
            Password: password
        }

        let authenticationDetails: AuthenticationDetails = new AuthenticationDetails(authenticationDefailsData);

        return Observable.create((observer: Observer<CognitoUserSession>) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (session: CognitoUserSession, userConfirmationNecessary?: boolean) => {
                    observer.next(session);
                },
                onFailure: (err: {mode: number, message: string}) => {
                    observer.error({
                        mode: 0,
                        message: err.message
                    });
                },
                newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
                    observer.error({
                        mode: 1,
                        message: "New Password Required"
                    })
                }
            })
        })

    }

    registration(username: string, password: string, email: string): Observable<any> {

        console.log("User Service - Register");

        let emailUserAttrobuteData: CognitoUserAttribute = new CognitoUserAttribute({
            Name: "email",
            Value: email
        })

        let userAttributes: CognitoUserAttribute[] = [];
        userAttributes.push(emailUserAttrobuteData);

        return Observable.create((observer: Observer<ISignUpResult>) => {
            this.userPool.signUp(username, password, userAttributes, null, (error: Error, result: ISignUpResult) => {
                if (error) {
                    observer.error(error.message);
                } else {
                    observer.next(result);
                }
            })
        })

    }

    confirmRegistration(username: string, code: string): Observable<any> {

        console.log("User Service - Confirm Registration");

        let cognitoUserData: ICognitoUserData = {
            Username: username,
            Pool: this.userPool
        }

        let cognitoUser: CognitoUser = new CognitoUser(cognitoUserData);

        return Observable.create((observer: Observer<any>) => {
            cognitoUser.confirmRegistration(code, false, (err: Error, result: any) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(result);
                }
            })
        })

    }

}