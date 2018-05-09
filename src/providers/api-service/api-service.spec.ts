// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from 'chai';

import { httpRequestMatcher } from '../../../spec/http';
import { ApiVersion } from '../../models';
import ApiService from './api-service';

describe('ApiService', function () {
  let apiService: ApiService;
  let httpTestingCtrl: HttpTestingController;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ApiService
      ]
    });

    apiService = TestBed.get(ApiService);
    httpTestingCtrl = TestBed.get(HttpTestingController);
  });

  afterEach(function() {
    // Make sure no extra HTTP requests were made.
    httpTestingCtrl.verify();
  });

  it('should construct', function () {
    expect(apiService).to.not.be.undefined;
  });

  describe('a call to the version() method', function () {

    const mockResponse = {
      version: "1.0.0"
    };

    it('should return the correct API version number', function () {

      let result;
      apiService.version().subscribe(res => result = res);

      httpTestingCtrl
        .expectOne(httpRequestMatcher('GET', '/'))
        .flush(mockResponse);

      expect(result).to.be.an.instanceOf(ApiVersion);
      expect(result.version).to.equal(mockResponse.version);
    });

  });

});
