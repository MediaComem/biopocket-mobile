import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import ApiService from '../api-service/api-service';
import { Location } from '../../models';
import Print from '../../utils/print';

/**
 * Handles request on the BioPocket API that are related to the management of Locations of interest 
 */
@Injectable()
export default class LocationsService {

  private resourceName: string = '/locations'

  constructor(private api: ApiService) {
    this.api.version().subscribe(ver => Print.log(ver));
  }

  testCall() {
    return "called";
  }

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

}
