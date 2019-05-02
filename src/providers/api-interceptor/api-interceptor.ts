import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first, switchMap } from 'rxjs/operators';

import { AuthService } from '@providers/auth-service/auth-service';
import { EnvService } from '@providers/env-service/env-service';

/**
 * HTTP interceptor that simplifies requests to the BioPocket API:
 *
 * * All requests made to simple paths with no base URL, e.g. `/users`, automatically have the
 *   backend URL prepended to form the full request URL, e.g. `https://biopocket.ch/api/users`.
 *   (Note that the request URL is not modified if it starts with `http://`, `https://` or `//`.)
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private readonly envService: EnvService,
    private readonly injector: Injector
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Automatically prepend the backend URL if the specified URL is a path (e.g. `/users`).
    const backendUrl = this.envService.backendUrl;
    const url = request.url.match(/^(?:https?:)?\/\/[^\/]/) ? request.url : `${backendUrl}${request.url}`;
    let modifiedRequest = request.clone({ url });

    // If request doest not target our backend, return the request without modification
    if (url.indexOf(backendUrl) !== 0) {
      return next.handle(modifiedRequest);
    }

    // Retrieve AuthProvider at runtime from the injector.
    // (Otherwise there would be a circular dependency:
    //  AuthInterceptorProvider -> AuthProvider -> HttpClient -> AuthInterceptorProvider).
    const authService = this.injector.get(AuthService);

    return authService.fetchToken().pipe(
      first(),
      switchMap(token => {

        // Add it to the request if it doesn't already have an Authorization header.
        if (token && !modifiedRequest.headers.has('Authorization')) {
          modifiedRequest = modifiedRequest.clone({
            headers: modifiedRequest.headers.set('Authorization', `Bearer ${token}`)
          });
        }

        return next.handle(modifiedRequest);
      })
    );
  }

}
