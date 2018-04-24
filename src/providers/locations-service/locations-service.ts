import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Location } from '../../models';

export type FetchLocationsParams = {
  bbox?: string;
};

/**
 * Handles request on the BioPocket API that are related to the management of Locations of interest.
 */
@Injectable()
export default class LocationsService {

  private resourcePath: string = '/locations'

  constructor(private httpClient: HttpClient) { }

  /**
   * Fetch all the locations from the backend
   * These locations can be filtered by passing an `options.bbox` argument (see here : https://mediacomem.github.io/biopocket-backend/api/#locations_get)
   * @param {Object} options - An option object to configure the fetch
   * @param {string} options.bbox - A string representing the bbox that the returned points must be within
   * @returns {Observable<Location>} An Observable of a Location array
   */
  fetchAll(params: FetchLocationsParams = {}): Observable<Location[]> {
    return this.httpClient.get<any[]>(this.resourcePath, { params }).map(data => data.map(parseApiLocation));
  }

  /**
   * Fetches one location from the backend, based on the given `id` argument.
   * @param {string} id The location id to fetch
   * @returns {Observable<Location>} An Observable of a Location
   */
  fetchOne(id: string): Observable<Location> {
    return this.httpClient.get(`${this.resourcePath}/${id}`).map(parseApiLocation);
  }

}

function parseApiLocation(data: any): Location {
  return new Location(data);
}
