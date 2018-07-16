// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { compact } from 'lodash';
import { Observable } from 'rxjs/Rx';

import EnvService from '@providers/env-service/env-service';
import { HeadersOrParams, httpRequestMatcher } from '@spec/http';
import { ApiInterceptor } from './api-interceptor';

type EnvServiceMock = Partial<EnvService>;

describe('ApiInterceptor', function () {
  let envServiceMock: EnvServiceMock;
  let httpClient: HttpClient;
  let httpTestingCtrl: HttpTestingController;

  beforeEach(function () {
    envServiceMock = {
      environment: 'development',
      backendUrl: 'https://example.com/api'
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: EnvService, useValue: envServiceMock },
        // Plug the interceptor in so that we can make HTTP requests
        // and see if it does its job correctly.
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingCtrl = TestBed.get(HttpTestingController);
  });

  afterEach(function() {
    // Make sure no extra HTTP requests were made.
    httpTestingCtrl.verify();
  });

  interface TestDefinition {
    method: string;
    body?: any;
    options?: {
      headers?: HeadersOrParams;
      params?: HeadersOrParams;
    };
  }

  // This array defines various HTTP request parameters to use for the following tests.
  const tests: TestDefinition[] = [
    { method: 'DELETE' },
    { method: 'GET', options: { headers: { Foo: 'Bar', Bar: [ 'Baz', 'Qux' ] }, params: { ping: 'pong' } } },
    { method: 'HEAD' },
    { method: 'OPTIONS' },
    { method: 'PATCH', body: { foo: 'bar' }, options: { headers: { Corge: 'Grault' } } },
    { method: 'POST', body: { bar: 'baz' }, options: { params: { page: 1, pageSize: 30 } } },
    { method: 'PUT', body: { baz: 'qux' } }
  ];

  // The tests in the following block are repeated for each definition in the array above,
  // in order to test multiple HTTP method/body/headers/params combinations.
  tests.forEach(testData => {

    /**
     * Makes a test HTTP request to the specified path or URL.
     * The HTTP method, request body and options are taken from the current test data (see array above).
     *
     * @param pathOrUrl The path or URL of the request.
     * @returns An observable of the HTTP response.
     */
    function makeTestRequest(pathOrUrl: string): Observable<any> {
      const args = compact([ pathOrUrl, testData.body, testData.options ]);
      return httpClient[testData.method.toLowerCase()](...args);
    }

    /**
     * Returns an HTTP request matching function that indicates whether a request has the expected properties.
     * The expected body, headers and params are taken from the current test data (see array above).
     *
     * Intended for use with HttpTestingController:
     *
     *      httpTestingCtrl
     *        .expectOne(testRequestMatcher('http://example.com/path'))
     *        .flush(someResponse);
     *
     * @param req The request to check.
     * @param expectedUrl The URL the request should be made to (without params).
     * @returns True if the request has exactly the expected properties, false otherwise.
     */
    function testRequestMatcher(expectedUrl: string): (req: HttpRequest<any>) => boolean {
      const testReqOptions = testData.options || {};
      return httpRequestMatcher(testData.method, expectedUrl, testData.body, testReqOptions.headers, testReqOptions.params);
    }

    const responseBody = Object.freeze({ foo: 'bar' });

    it(`should prepend the backend URL to paths for a ${testData.method} request`, function() {

      const path = '/things';

      let result;
      makeTestRequest(path).subscribe(res => result = res);

      httpTestingCtrl
        .expectOne(testRequestMatcher(`${envServiceMock.backendUrl}${path}`))
        .flush(responseBody);

      expect(result).to.eql(responseBody);
    });

    it(`should not prepend the backend URL to a full HTTP URL for a ${testData.method} request`, function() {

      const url = 'http://things.com/all';

      let result;
      makeTestRequest(url).subscribe(res => result = res);

      httpTestingCtrl
        .expectOne(testRequestMatcher(url))
        .flush(responseBody);

      expect(result).to.eql(responseBody);
    });

    it(`should not prepend the backend URL to a full HTTPS URL for a ${testData.method} request`, function() {

      const url = 'https://things.com/all';

      let result;
      makeTestRequest(url).subscribe(res => result = res);

      httpTestingCtrl
        .expectOne(testRequestMatcher(url))
        .flush(responseBody);

      expect(result).to.eql(responseBody);
    });

    it(`should not prepend the backend URL to a root URL for a ${testData.method} request`, function() {

      const url = '//images/brand.png';

      let result;
      makeTestRequest(url).subscribe(res => result = res);

      httpTestingCtrl
        .expectOne(testRequestMatcher(url))
        .flush(responseBody);

      expect(result).to.eql(responseBody);
    });
  });
});
