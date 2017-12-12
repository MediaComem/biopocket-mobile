// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpModule, Http, ConnectionBackend, RequestOptions, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { expect } from 'chai';
import { RequestBuilderModule } from 'ng-request-builder';

import ApiService from './api-service';
import EnvService from '../env-service/env-service';
import EnvInterface from '../../environments/environment.interface';
import { ApiVersion } from '../../models';

const MockENV: EnvInterface = {
  environment: 'development',
  backendUrl: 'http://test.com/api'
}

describe('ApiService', function () {
  let apiService: ApiService;
  let backEnd: MockBackend;
  let lastConnection;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        RequestBuilderModule,
        HttpModule
      ],
      providers: [
        Http,
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: EnvService, useValue: MockENV },
        ApiService
      ]
    });

    apiService = TestBed.get(ApiService);
    backEnd = TestBed.get(ConnectionBackend) as MockBackend;
    backEnd.connections.subscribe((connection: any) => lastConnection = connection);
  });

  afterEach(function () {
    apiService = null;
  });

  it('should construct', function () {
    expect(apiService).to.not.be.undefined;
  });

  describe('a call to the version() method', function () {

    const mockResponse = {
      version: "1.0.0"
    }

    it('should return the correct API version number', fakeAsync(function () {
      let result;

      apiService.version().subscribe(res => result = res);
      lastConnection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      tick();

      expect(result).to.be.an.instanceOf(ApiVersion);
      expect(result.version).to.equal(mockResponse.version);
    }));

  });

});