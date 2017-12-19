// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Http, ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';
import { spy, stub } from 'sinon';

import { Deferred } from '../../../spec/utils';
import { ENV as MockEnv } from '../../environments/environment.test';
import { fr } from '../../locales';
import Marker from '../../models/marker';
import EnvService from '../../providers/env-service/env-service';
import locationsDataMock from '../../providers/locations-service/locations-data.mock';
import LocationsModule from '../../providers/locations-service/locations-module';
import { expect } from '../../../spec/chai';
import { translateModuleForRoot } from '../../utils/i18n';
import { MapPage } from './map';

describe('MapPage', function () {
  let component, fixture, backend;
  let geolocationMock, geolocationDeferred;
  let navControllerMock;

  beforeEach(function () {

    geolocationDeferred = new Deferred();
    geolocationMock = {
      getCurrentPosition: stub().returns(geolocationDeferred.promise)
    };

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
        { provide: Geolocation, useValue: geolocationMock },
        { provide: NavController, useValue: navControllerMock },
        { provide: EnvService, useValue: MockEnv },
        Http,
        { provide: ConnectionBackend, useClass: MockBackend }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');

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

      // This test lets Leaflet initialize a real map in the view.
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

      component.map.setView([12, 4], 15);

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

    describe('and initialized', function() {

      let map, setViewSpy;
      beforeEach(function() {

        // The tests in this describe block use a Leaflet map that is manually
        // instantiated here rather than in the view.
        map = L.map('map');
        setViewSpy = spy(map, 'setView');

        expect(geolocationMock.getCurrentPosition).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(0);

        expect(component.mapMessage).to.equal(undefined);

        component.onMapReady(map);

        expect(geolocationMock.getCurrentPosition).to.have.callCount(1);
        expectMapViewSet(setViewSpy.args[0], [ 46.183541, 6.100234 ], 15);
        expect(setViewSpy).to.have.callCount(1);

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);
      });

      it('should automatically center the map on the user if in Onex', fakeAsync(function() {

        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expectMapViewSet(setViewSpy.args[1], L.latLng(46.18, 6.09), 15, { animate: true });
        expect(setViewSpy).to.have.callCount(2);
      }));

      it('should leave the map centered on Onex if the user is not there', fakeAsync(function() {

        geolocationDeferred.resolve({ coords: { longitude: 8, latitude: 48 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expectMapViewSet(setViewSpy.args[0], [ 46.183541, 6.100234 ], 15);
        expect(setViewSpy).to.have.callCount(1);
      }));

      it('should leave the map centered on Onex if the user cannot be located', fakeAsync(function() {

        geolocationDeferred.reject(new Error('Dunno where you are'));
        tick();

        expect(component.mapMessage).to.equal(undefined);
        expect(setViewSpy).to.have.callCount(1);
      }));

      it('should center the map on the user\'s current position when clicking on the center me button', fakeAsync(function() {

        geolocationDeferred.resolve({ coords: { longitude: 1, latitude: 0 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expectMapViewSet(setViewSpy.args[0], [ 46.183541, 6.100234 ], 15);
        expect(setViewSpy).to.have.callCount(1);

        const currentPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(1).returns(currentPositionDeferred.promise);

        component.centerOnMe();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);

        currentPositionDeferred.resolve({ coords: { longitude: 24, latitude: 42 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expectMapViewSet(setViewSpy.args[1], L.latLng(42, 24), 15, { animate: true });
        expect(setViewSpy).to.have.callCount(2);
      }));

      it('should center the map on the user\'s initial position when clicking on the center me button before the initial position has been determined', fakeAsync(function() {

        const currentPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(1).returns(currentPositionDeferred.promise);

        const nextPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(2).returns(nextPositionDeferred.promise);

        // Click before initial position has been determined.
        component.centerOnMe();

        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        expect(setViewSpy).to.have.callCount(2);
        expectMapViewSet(setViewSpy.args[1], L.latLng(46.18, 6.09), 15, { animate: true });
        expect(component.mapMessage).to.equal(undefined);

        currentPositionDeferred.resolve({ coords: { longitude: 24, latitude: 42 } });
        tick();

        expect(setViewSpy).to.have.callCount(2);
        expect(component.mapMessage).to.equal(undefined);
      }));
    });

    function expectMapViewSet(actual, coordinates, zoom, options?: any) {

      if (coordinates instanceof L.LatLng) {
        expect(actual[0]).to.be.an.instanceof(L.LatLng);
        expect(actual[0].lng).to.equal(coordinates.lng);
        expect(actual[0].lat).to.equal(coordinates.lat);
      } else {
        expect(actual[0]).to.eql(coordinates);
      }

      expect(actual[1]).to.equal(zoom);

      const actualOptions = actual[2];
      if (options) {
        for (let property in options) {
          expect(actualOptions[property], `options.${property}`).to.eql(options[property]);
        }
      } else {
        expect(actualOptions).to.equal(undefined);
      }

      expect(actual).to.have.lengthOf.at.most(3);
    }
  });
});
