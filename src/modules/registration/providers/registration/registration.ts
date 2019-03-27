import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Print } from '@print';
import { Registration } from '../../classes/registration';

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[RegistrationService]';

const RESOURCE_PATH = '/registrations';

@Injectable()
export class RegistrationService {

  // Indicates wether or not the user has already registered (this reset at each app launch).
  userRegistered: boolean;
  // The registraiton object saved on the backend (this reset at each app launch).
  registration: Registration;

  constructor(private readonly http: HttpClient) {
    this.userRegistered = false;
    this.registration = {};
  }

  /**
   * Sends a registration to the backend in order to save it.
   * @param registration The registration object to send.
   * @returns The saved registration received by the backend.
   */
  sendRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(RESOURCE_PATH, registration)
      .pipe(map(savedRegistration => {
        this.userRegistered = true;
        this.registration = savedRegistration;
        return savedRegistration;
      }))
      .catch(error => {
        Print.error(LOG_REF, error);
        this.userRegistered = false;
        return Observable.throw(error);
      });
  }

  /**
   * Delets a registration from the backend, based on the provided email.
   * @param email The email of the registration to delete.
   */
  deleteRegistration(email: string): Observable<HttpResponse<void>> {
    return this.http.delete(`${RESOURCE_PATH}/${email}`, { observe: 'response' })
      .pipe(tap(() => {
        this.userRegistered = false;
        this.registration = {};
      }))
      .catch(error => {
        Print.error(LOG_REF, error);
        return Observable.throw(error);
      });
  }

  /**
   * Checks if the given email exists in the database, that is if one Registration has already been created using this email.
   * @param email The email whose existence is checked.
   * @throws If the request fails with a code other than `404`.
   * @returns The return Observable's value will be `true` if the email exists, `false` otherwise
   */
  checkEmailExistence(email: string): Observable<boolean> {
    return this.http.head(`${RESOURCE_PATH}/${email}`, { observe: 'response' })
      .pipe(map(response => response.status === 200))
      .catch(error => {
        return error.status === 404 ? Observable.of(false) : Observable.throw(error);
      });
  }

}
