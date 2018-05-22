import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { ApiVersion } from '../../models';

/**
 * API service for generic top-level resources of the BioPocket API.
 */
@Injectable()
export default class ApiService {

  constructor(private readonly httpClient: HttpClient) { }

  /**
   * Query the BioPocket API to get information about the current api version.
   *
   * @returns {Observable<ApiVersion>} An Observable of an ApiVersion object
   */
  version(): Observable<ApiVersion> {
    return this.httpClient.get('/').pipe(map(data => new ApiVersion(data)));
  }

}
