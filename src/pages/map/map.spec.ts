// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed } from '@angular/core/testing';
import { Http, ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { expect } from 'chai';
import { IonicModule, NavController } from 'ionic-angular';
import * as L from 'leaflet';
import { spy } from 'sinon';

import { ENV as MockEnv } from '../../environments/environment.test';
import Marker from '../../models/marker';
import EnvService from '../../providers/env-service/env-service';
import locationsDataMock from '../../providers/locations-service/locations-data.mock';
import LocationsModule from '../../providers/locations-service/locations-module';
import { translateModuleForRoot } from '../../utils/i18n';
import { MapPage } from './map';

describe('MapPage', function () {
  let component, fixture, backend;
  let navControllerMock;

  beforeEach(function () {
    navControllerMock = {};

    TestBed.configureTestingModule({
      declarations: [
        MapPage
      ],
      imports: [
        IonicModule.forRoot(MapPage),
        translateModuleForRoot,
        LeafletModule.forRoot(),
        LocationsModule
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock },
        { provide: EnvService, useValue: MockEnv },
        Http,
        { provide: ConnectionBackend, useClass: MockBackend }
      ]
    });

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;

    backend = TestBed.get(ConnectionBackend) as MockBackend;
    // backend.connections.subscribe((connection: any) => { lastConnection = connection });
  });

  afterEach(function () {
    component = null;
  });

  it('should be created', function () {
    expect(component).to.be.an.instanceOf(MapPage);
  });

  it('should have a valid mapOptions property', function () {
    expect(component, 'MapPage has no mapOptions property').to.haveOwnProperty('mapOptions');
    expect(component.mapOptions, 'MapPage.mapOptions has no layers property').to.haveOwnProperty('layers');
    expect(component.mapOptions.layers, 'MapPage.mapOptions.layers is not an array').to.be.an('array');
    component.mapOptions.layers.forEach(layer => {
      expect(layer).to.be.an.instanceOf(L.TileLayer);
    });
  });

  describe('when the map is ready', function () {
    it('should attach the map to the component and initialize it', async function () {

      expect(component.map).to.equal(undefined);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.map).to.be.an.instanceof(L.Map);
      expect(component.map.getZoom()).to.equal(15);

      const center = component.map.getCenter();
      expect(center.lat).to.equal(46.183541);
      expect(center.lng).to.equal(6.100234);
    });

    it('should load location points on the map', async function () {
      backend.connections.subscribe((connection: any) => {
        if (connection.request.url.includes(`${MockEnv.backendUrl}/locations`)) {
          connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(locationsDataMock) })));
        }
      });

      expect(component.layers).to.be.an('array');
      expect(component.layers).to.have.length(0);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.layers).to.have.length(3);
      component.layers.forEach((marker, pos) => {
        expect(marker).to.be.an.instanceOf(Marker);

        let latLng = marker.getLatLng();
        expect(latLng.lat).to.equal(locationsDataMock[pos].geometry.coordinates[1]);
        expect(latLng.lng).to.equal(locationsDataMock[pos].geometry.coordinates[0]);
      })
    })

    it('should reload locations after the map has been panned', async function () {
      const spyFetchAll = spy(component.locationsService, 'fetchAll');

      const responses = [
        { body: JSON.stringify(locationsDataMock.slice(0, 2)) },
        { body: JSON.stringify(locationsDataMock.slice(1)) }
      ]

      backend.connections.subscribe((connection: any) => {
        if (connection.request.url.includes(`${MockEnv.backendUrl}/locations`)) {
          connection.mockRespond(new Response(new ResponseOptions(responses.shift())));
        }
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(spyFetchAll.callCount).to.equal(1);
      expect(component.layers).to.have.length(2);

      let markerIds = component.layers.map(marker => marker.id);
      let expectedIds = locationsDataMock.slice(0, 2).map(location => location.id);

      expect(markerIds).to.have.members(expectedIds);

      component.map.setView([12, 4], 13);

      const callOptions = {
        bbox: component.map.getBounds().toBBoxString()
      }

      fixture.detectChanges();
      await fixture.whenStable();
      
      expect(spyFetchAll.callCount).to.equal(2);
      expect(spyFetchAll.getCall(1).args[0]).to.eql(callOptions);

      markerIds = component.layers.map(marker => marker.id);
      expectedIds = locationsDataMock.slice(1).map(location => location.id);

      expect(markerIds).to.have.members(expectedIds);
    });
  });
});
