import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { Location } from '@models/location';

/**
 * Represents available parameters when fetching all the locations
 * @property {string} [bbox] - A string representing the bbox that the returned points must be within.
 */
interface FetchLocationsParams {
  bbox?: string;
  [key: string]: string | string[];
}

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[LocationsService]';
const RESOURCE_PATH = '/locations';

/**
 * Handles request on the BioPocket API that are related to the management of Locations of interest.
 */
@Injectable()
export default class LocationsService {

  constructor(private readonly httpClient: HttpClient) { }

  /**
   * Fetch all the locations from the backend
   * These locations can be filtered by passing an `params.bbox` argument (see here : https://mediacomem.github.io/biopocket-backend/api/#locations_get)
   * @param {FetchLocationsParams} params - An params object to configure the fetch
   * @returns {Observable<Location>} An Observable of a Location array
   */
  fetchAll(params: FetchLocationsParams = {}): Observable<Location[]> {
    return this.httpClient.get<any[]>(RESOURCE_PATH, { params }).pipe(map(data => data.map(parseApiLocation)));
  }

  /**
   * Fetches one location from the backend, based on the given `id` argument.
   * @param {string} id The location id to fetch
   * @returns {Observable<Location>} An Observable of a Location
   */
  fetchOne(id: string): Observable<Location> {
    return this.httpClient.get(`${RESOURCE_PATH}/${id}`).pipe(map(parseApiLocation));
  }

}

function parseApiLocation(data: any): Location {
  return new Location(data);
}
