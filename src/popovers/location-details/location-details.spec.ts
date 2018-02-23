// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { ConnectionBackend, ResponseOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { IonicModule, ViewController, NavParams } from 'ionic-angular';
import { stub, spy } from 'sinon';

import { expect } from '../../../spec/chai';
import { ENV as MockEnv } from '../../environments/environment.test';
import LocationDetails from '../location-details/location-details';
import EnvService from '../../providers/env-service/env-service';
import locationsDataMock from '../../providers/locations-service/locations-data.mock';
import LocationsModule from '../../providers/locations-service/locations-module';
import LocationsService from '../../providers/locations-service/locations-service';
import { Location } from '../../models';

describe('LocationDetails', function () {
  let component: LocationDetails, fixture;
  let viewControllerMock, navParamsMock, locationsServiceMock;

  beforeEach(async(function () {
    viewControllerMock = {
      dismiss: stub()
    };
    navParamsMock = {
      data: {
        locationId: '8e4fuiwh-e4g5-peok-998k-9e8j4s8hjt5j'
      }
    };

    locationsServiceMock = {
      fetchOne: stub().returns({
        subscribe: callback => {
          return callback(new Location(locationsDataMock[2]));
        }
      })
    };

    TestBed.configureTestingModule({
      declarations: [
        LocationDetails
      ],
      imports: [
        IonicModule.forRoot(LocationDetails),
        LocationsModule
      ],
      providers: [
        { provide: ViewController, useValue: viewControllerMock },
        { provide: NavParams, useValue: navParamsMock },
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: EnvService, useValue: MockEnv },
        { provide: LocationsService, useValue: locationsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(LocationDetails)
    component = fixture.componentInstance;
  });

  it('should initialize with the requested Location', async function () {
    expect(component).to.be.an.instanceof(LocationDetails);
    expect(component.location).to.be.undefined;

    fixture.detectChanges();
    await fixture.whenStable();

    expect(locationsServiceMock.fetchOne).to.have.been.calledOnce;
    expect(locationsServiceMock.fetchOne).to.have.been.calledWithExactly(navParamsMock.data.locationId);

    expect(component.location).to.be.an.instanceof(Location);
    expect(component.location.id).to.equal(navParamsMock.data.locationId);
  });

  it('should close itself', function () {
    component.close();

    expect(viewControllerMock.dismiss).to.have.been.calledOnce;
  })
});