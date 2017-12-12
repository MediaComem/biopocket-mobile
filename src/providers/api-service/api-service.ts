import { Injectable } from '@angular/core';
import EnvService from '../env-service/env-service';
import { Response } from '@angular/http';
import { RequestBuilderService, RequestBuilder } from 'ng-request-builder';
import { Observable } from 'rxjs/Observable';

import { ApiVersion } from '../../models';
import Print from '../../utils/print';

/**
 * Global service that handles communication with the BioPocket API
 * Should be imported and used by any other service that needs to communicate with the API
 */
@Injectable()
export default class ApiService {

  constructor(private reqBuilder: RequestBuilderService, private env: EnvService) { }

  /**
   * Returns the backend api url corresponding to the current environment
   */
  get url(): string {
    return this.env.backendUrl;
  }

  /**
   * Query the BioPocket API to get information about the current api version
   * @returns {Observable<ApiVersion>} An Observable of an ApiVersion object
   */
  public version(): Observable<ApiVersion> {
    return this.reqBuilder.request(this.env.backendUrl)
      .execute()
      .map((res: Response) => {
        return new ApiVersion(res.json());
      });
  }

  /**
   * Execute a GET request on the API.
   * The URL upon which the request will be executed is created by the API base URL to which the `resource` value is concatenated.
   * TODO : This function will certainly be enhanced/changed/splitted later
   * @param {string} resource - The relative URL representing the API resources that will be queried. Ex: "/locations"
   * @returns {Observable<Response>} - An Observable of an Http Response.
   */
  public get(resource: string): RequestBuilder {
    return this.reqBuilder.request(this.env.backendUrl + resource)
  }

}
