import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import ApiService from '../api-service/api-service';
import { Location } from '../../models';

/**
 * Handles request on the BioPocket API that are related to the management of Locations of interest 
 */
@Injectable()
export default class LocationsService {

  private resourceName: string = '/locations'

  constructor(private api: ApiService) { }

  /**
   * Fetch all the locations from the backend
   * These locations can be filtered by passing an `options.bbox` argument (see here : https://mediacomem.github.io/biopocket-backend/api/#locations_get)
   * @param {Object} options - An option object to configure the fetch
   * @param {string} options.bbox - A string representing the bbox that the returned points must be within
   * @returns {Observable<Location>} An Observable of a Location array
   */
  fetchAll(options?: any): Observable<Location[]> {
    const request = this.api.get(this.resourceName)
    if (options && options.bbox) request.setSearchParam('bbox', options.bbox);
    return request.execute()
      .map((res: Response) => {
        return res.json().map((locData: Object) => {
          return new Location(locData);
        })
      });
  }

  /**
   * Fetches one location from the backend, based on the given `id` argument.
   * @param {string} id The location id to fetch
   * @returns {Observable<Location>} An Observable of a Location
   */
  fetchOne(id: string): Observable<Location> {
    return this.api.get(`${this.resourceName}/${id}`)
      .execute()
      .map((res: Response) => {
        return new Location(res.json());
      });
  }

}
