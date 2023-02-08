import { Injectable } from '@angular/core';
import { Observable, of, catchError, tap } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

// Interface Imports
import { LoginCredentials, SignUpCredentials } from '../interfaces/credentials';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    // URL
    private URL = 'http://localhost:5005';

    constructor(private http: HttpClient) {}

    signUpUser(credentials: SignUpCredentials): Observable<any> {
        const url = this.URL + '/user/add-user';

        return this.http
            .post(url, credentials, { observe: 'response' })
            .pipe(catchError(this.handleError('User signup Failed')));
    }

    loginUser(credentials: LoginCredentials): Observable<any> {
        const url = this.URL + '/user/login';

        return this.http
            .post(url, credentials, { observe: 'response' })
            .pipe(catchError(this.handleError('Login Failed')));
    }

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    private handleError<T>(message:string = 'Failed', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send error to remote logging infrastructure
            console.error(error);
            console.log(message);

            // Let the app keep running by returning an empty result
            return of(result as T);
        };
    }
}
