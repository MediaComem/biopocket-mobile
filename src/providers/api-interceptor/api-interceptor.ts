import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import EnvService from '../env-service/env-service';

/**
 * HTTP interceptor that simplifies requests to the BioPocket API:
 *
 * * All requests made to simple paths with no base URL, e.g. `/users`, automatically have the
 *   backend URL prepended to form the full request URL, e.g. `https://biopocket.ch/api/users`.
 *   (Note that the request URL is not modified if it starts with `http://`, `https://` or `//`.)
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private envService: EnvService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Automatically prepend the backend URL if the specified URL is a path (e.g. `/users`).
    const backendUrl = this.envService.backendUrl;
    const url = request.url.match(/^(?:https?:)?\/\/[^\/]/) ? request.url : `${backendUrl}${request.url}`;
    request = request.clone({ url });

    // TODO: automatically set the Authorization header when communicating with the BioPocket API
    if (url.indexOf(backendUrl) === 0) {
      request = request.clone({
        setHeaders: {
          //Authorization: `Bearer changeme`
        }
      });
    }

    return next.handle(request);
  }

}
