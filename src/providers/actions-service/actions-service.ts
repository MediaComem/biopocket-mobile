import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import Action from '@models/action';
import PaginatedResponse from '@models/paginated-response';

/**
 * Defines the structure of fetch actions parameters.
 */
interface FetchActionsParams {
  offset?: string;
  limit?: string;
  include?: string | string[];
  [key: string]: string | string[];
}

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[ActionsService]';
const RESOURCE_PATH = '/actions';

@Injectable()
export default class ActionsService {

  constructor(private readonly http: HttpClient) {
  }

  /**
   * Fetchs some paginated actions from the BioPocket API.
   * @param params Parameters to pass to the request.
   */
  fetchPaginatedActions(params: FetchActionsParams = {}): Observable<PaginatedResponse<Action>> {
    return this.http
      .get<any[]>(RESOURCE_PATH, { params, observe: 'response' })
      .pipe(map(response => {
        return new PaginatedResponse<Action>(response, parseApiAction);
      }));
  }
}

/**
 * Transforms raw action data into an instance of Action.
 * @param data Raw action data.
 */
function parseApiAction(data: any): Action {
  return new Action(data);
}
