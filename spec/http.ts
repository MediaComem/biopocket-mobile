import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { isEqual, isEmpty } from 'lodash';

import { expect } from './chai';

/**
 * A single value of an HTTP header or query parameter.
 */
export type HeadersOrParamsValue = boolean | number | string;

/**
 * A plain object that represents the headers or query parameters of an HTTP request. Single or
 * multiple values of various types are permitted.
 */
export type HeadersOrParams = { [name: string]: HeadersOrParamsValue | HeadersOrParamsValue[]; };

/**
 * A plain object that represents the headers or query parameters of an HTTP request in a normalized
 * format. The value of a header or param is always a string array.
 */
export type NormalizedHeadersOrParams = { [name: string]: string[]; };

/**
 * Asserts that the specified HTTP request has the expected properties. If not, an error is thrown
 * describing why the request does not match.
 *
 * @param actual The request to check.
 * @param expectedMethod The method the request should use (e.g. GET, POST).
 * @param expectedUrl The URL the request should be made to.
 * @param expectedBody The body the request should have.
 * @param expectedHeaders The headers the request should have (values are normalized to string arrays, so you can use single values, numbers, etc).
 * @param expectedParams The query parameters the request should have (values are normalized to string arrays, so you can use single values, numbers, etc).
 */
export function assertHttpRequest(actual: HttpRequest<any>, expectedMethod: string, expectedUrl: string, expectedBody?: any, expectedHeaders?: HttpHeaders | HeadersOrParams, expectedParams?: HttpParams | HeadersOrParams): void {

  const actualDescription = describeHttpRequest(actual);
  if (!actual) {
    throw new Error(`Expected an HTTP request matching ${actualDescription}, but got ${typeof(actual)}`);
  }

  const problems = [];

  if (actual.method.toUpperCase() !== expectedMethod.toUpperCase()) {
    problems.push('method does not match');
  }

  if (actual.url !== expectedUrl) {
    problems.push('URL does not match');
  }

  if (!isEqual(actual.body || null, expectedBody || null)) {
    problems.push('body does not match');
  }

  if (!isEqual(normalizeHeadersOrParams(actual.headers), normalizeHeadersOrParams(expectedHeaders))) {
    problems.push('headers do not match');
  }

  if (!isEqual(normalizeHeadersOrParams(actual.params), normalizeHeadersOrParams(expectedParams))) {
    problems.push('params do not match');
  }

  if (problems.length >= 1) {
    const expectedDescription = describeHttpRequest(expectedMethod, expectedUrl, expectedBody, expectedHeaders, expectedParams);
    throw new Error(`Expected an HTTP request matching ${expectedDescription} but got ${actualDescription}: ${problems.join(', ')}`);
  }
}

/**
 * Returns a string describing an HttpRequest object.
 *
 * @param req The HTTP request to describe.
 * @returns A description of the request.
 */
export function describeHttpRequest(req: HttpRequest<any>);

/**
 * Returns a string describing an HTTP request.
 *
 * @param method The HTTP method the request uses.
 * @param url The URL the request is made to.
 * @param body The body of the request (if any).
 * @param headers The HTTP headers the request has (if any).
 * @param params The query parameters the request has (if any).
 * @returns A description of the request.
 */
export function describeHttpRequest(method: string, url: string, body?: any, headers?: HttpHeaders | HeadersOrParams, params?: HttpParams | HeadersOrParams);

export function describeHttpRequest(reqOrMethod: HttpRequest<any> | string, url?: string, body?: any, headers?: HttpHeaders | HeadersOrParams, params?: HttpParams | HeadersOrParams): string {

  let method: string;
  if (reqOrMethod instanceof HttpRequest) {
    method = reqOrMethod.method;
    url = reqOrMethod.url;
    body = reqOrMethod.body;
    headers = normalizeHeadersOrParams(reqOrMethod.headers);
    params = normalizeHeadersOrParams(reqOrMethod.params);
  } else {
    method = reqOrMethod;
    headers = normalizeHeadersOrParams(headers);
    params = normalizeHeadersOrParams(params);
  }

  let description = `${method} ${url}`;
  let details = [];

  if (body) {
    details.push(`body ${JSON.stringify(body)}`);
  }

  if (headers && !isEmpty(headers)) {
    details.push(`headers ${JSON.stringify(headers)}`);
  }

  if (params && !isEmpty(params)) {
    details.push(`params ${JSON.stringify(params)}`);
  }

  if (details.length) {
    description = `${description} with ${details.join(' and ')}`;
  }

  return description;
}

/**
 * Returns an HTTP request matching function that indicates whether a request has the expected properties.
 *
 * Intended for use with HttpTestingController:
 *
 *     httpTestingCtrl
 *       .expectOne(httpRequestMatcher('GET', 'http://example.com/path', { some: 'body' }, { Authorization: 'Bearer changeme' }, { page: 3 }))
 *       .flush(someResponse);
 *
 * @param expectedMethod The method the request should use (e.g. GET, POST).
 * @param expectedUrl The URL the request should be made to.
 * @param expectedBody The body the request should have.
 * @param expectedHeaders The headers the request should have (values are normalized to string arrays, so you can use single values, numbers, etc).
 * @param expectedParams The query parameters the request should have (values are normalized to string arrays, so you can use single values, numbers, etc).
 * @returns True (or an error is thrown).
 */
export function httpRequestMatcher(expectedMethod: string, expectedUrl: string, expectedBody?: any, expectedHeaders?: HttpHeaders | HeadersOrParams, expectedParams?: HttpParams | HeadersOrParams): (req: HttpRequest<any>) => boolean {
  return (req: HttpRequest<any>) => {
    assertHttpRequest(req, expectedMethod, expectedUrl, expectedBody, expectedHeaders, expectedParams);
    return true;
  };
}

/**
 * Converts an Angular headers or params object to a plain object that has header/param names as
 * keys and string arrays as values. An empty object is returned if the input is null or undefined.
 *
 *     normalizeHeadersOrParams(headers);      // => { "Content-Type": [ "application/json" ] }
 *     normalizeHeadersOrParams(null);         // => {}
 *     normalizeHeadersOrParams({ page: 2 });  // => { "page": [ "2" ] }
 *
 * This can be used to check, for example, whether headers in different formats are in fact
 * equivalent (such as an HttpHeaders object and a plain object).
 *
 * @param data The Angular headers or params to convert.
 * @returns A plain object.
 */
export function normalizeHeadersOrParams(data: HttpHeaders | HttpParams | HeadersOrParams): NormalizedHeadersOrParams {
  const result = {};

  if (data instanceof HttpHeaders || data instanceof HttpParams) {
    for (let name of data.keys()) {
      result[name] = data.getAll(name).map(value => String(value));
    }
  } else if (data) {
    for (let name in data) {
      const values = data[name];
      if (Array.isArray(values)) {
        result[name] = values.map(value => String(value));
      } else {
        result[name] = [ String(values) ];
      }
    }
  }

  return result;
}
