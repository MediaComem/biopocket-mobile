import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { delayWhen, map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { AuthResponse } from '@models/auth-response';
import { User, UserCredentials } from '@models/user.interface';
import { Print } from '@print';

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[AuthService]';
const RESOURCE_PATH = '/auth';

@Injectable()
export class AuthService {

  private readonly authObs: ReplaySubject<AuthResponse>;

  constructor(
    private readonly http: HttpClient,
    private readonly storage: Storage) {
      this.authObs = new ReplaySubject(1);
  
      this.storage.get('auth').then((auth: AuthResponse) => {
        // Push the loaded value into the observable stream.
        this.authObs.next(auth);
      });
  }

  isAuthenticated(): Observable<boolean> {
    return this.authObs.pipe(map(Boolean));
  }

  fetchUser(): Observable<User> {
    return this.authObs.pipe(map(auth => auth ? auth.user : undefined));
  }

  fetchToken(): Observable<string> {
    return this.authObs.pipe(map(auth => auth ? auth.token : undefined));
  }

  logIn(credentials: UserCredentials): Observable<User> {

    return this.http.post<AuthResponse>(RESOURCE_PATH, credentials).pipe(
      delayWhen(auth => {
        console.log(`${LOG_REF} Auth in delayWhen`, auth);
        return this.saveAuth(auth);
      }),
      map(auth => {
        console.log(`${LOG_REF} Auth in map`, auth);
        this.authObs.next(auth);
        Print.log(`User ${auth.user.email} logged in`);
        return auth.user;
      })
    );
  }

  logOut() {
    this.authObs.next(null);
    this.storage.remove('auth');
    Print.log('User logged out');
  }

  private saveAuth(auth: AuthResponse): Observable<void> {
    return Observable.fromPromise(this.storage.set('auth', auth));
  }

}
