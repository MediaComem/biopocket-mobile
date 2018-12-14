// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed } from '@angular/core/testing';
import { ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule, NavParams, ViewController } from 'ionic-angular';
import { stub } from 'sinon';

import { ENV as MockEnv } from '@app/environments/environment.test';
import { fr } from '@app/locales';
import { Location } from '@models/location';
import { EnvService } from '@providers/env-service/env-service';
import { locationsDataMock } from '@providers/locations-service/locations-data.mock';
import { LocationsModule } from '@providers/locations-service/locations-module';
import { LocationsService } from '@providers/locations-service/locations-service';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';
import { observableOf } from '@utils/observable';
import { LocationDetails } from './location-details';

describe('LocationDetails', function() {
  let component: LocationDetails, fixture;
  let viewControllerMock, navParamsMock, locationsServiceMock;

  beforeEach(() => {
    viewControllerMock = {
      dismiss: stub()
    };
    navParamsMock = {
      data: {
        locationId: '8e4fuiwh-e4g5-peok-998k-9e8j4s8hjt5j'
      }
    };

    locationsServiceMock = {
      fetchOne: stub().returns(observableOf(locationsDataMock[2]))
    };

    TestBed.configureTestingModule({
      declarations: [
        LocationDetails
      ],
      imports: [
        IonicModule.forRoot(LocationDetails),
        LocationsModule,
        translateModuleForRoot
      ],
      providers: [
        { provide: ViewController, useValue: viewControllerMock },
        { provide: NavParams, useValue: navParamsMock },
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: EnvService, useValue: MockEnv },
        { provide: LocationsService, useValue: locationsServiceMock }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDetails);
    component = fixture.componentInstance;
  });

  it('should initialize with the requested Location', async function() {
    expect(component).to.be.an.instanceof(LocationDetails);
    expect(component.location).to.equal(undefined);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(locationsServiceMock.fetchOne).to.have.callCount(1);
    expect(locationsServiceMock.fetchOne).to.have.been.calledWithExactly(navParamsMock.data.locationId);

    expect(component.location).to.be.an.instanceof(Location);
    expect(component.location.id).to.equal(navParamsMock.data.locationId);
  });

  describe('#close', () => {

    it('should dismiss the popover', function() {
      component.close();

      expect(viewControllerMock.dismiss).to.have.callCount(1);
    });

  });

});
