// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Http, ConnectionBackend, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicModule, NavController, PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import * as L from 'leaflet';
import { MockComponent } from 'ng2-mock-component';
import { TranslateService } from '@ngx-translate/core';
import { spy, stub } from 'sinon';

import { Deferred } from '../../../spec/utils';
import { ENV as MockEnv } from '../../environments/environment.test';
import { fr } from '../../locales';
import Marker from '../../models/marker';
import LocationDetails from '../../popovers/location-details/location-details';
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
  let popoverCtrlMock, popoverMock;

  beforeEach(function () {

    geolocationDeferred = new Deferred();
    geolocationMock = {
      getCurrentPosition: stub().returns(geolocationDeferred.promise)
    };

    popoverMock = {
      present: stub().returns(new Deferred().promise)
    };
    popoverCtrlMock = {
      create: stub().returns(popoverMock)
    };

    navControllerMock = {};

    TestBed.configureTestingModule({
      declarations: [
        MapPage,
        MockComponent({ template: `<h1>Toto</h1>` })
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
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: PopoverController, useValue: popoverCtrlMock }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;

    backend = TestBed.get(ConnectionBackend) as MockBackend;
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
    });

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

      expect(spyFetchAll).to.have.been.calledOnce;
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

      expect(spyFetchAll).to.have.been.calledTwice;
      expect(spyFetchAll).to.have.been.calledWith(callOptions);

      markerIds = component.layers.map(marker => marker.id);
      expectedIds = locationsDataMock.slice(1).map(location => location.id);

      expect(markerIds).to.have.members(expectedIds);
    });

    it('should open a Popover when a location\'s marker is clicked', async function () {
      const spyFetchOne = spy(component.locationsService, 'fetchOne');

      const eMock = {
        target: {
          id: 'c821bc0f-85b4-44d5-9bbe-a30cf197c30a',
          _latlng: new L.LatLng(56, 9)
        }
      }

      const responses = [
        { body: JSON.stringify(locationsDataMock) },
        { body: JSON.stringify(locationsDataMock[0]) }
      ];

      backend.connections.subscribe((connection: any) => {
        if (connection.request.url.includes(`${MockEnv.backendUrl}/locations`)) {
          connection.mockRespond(new Response(new ResponseOptions(responses.shift())));
        } else if (connection.request.url.includes(`${MockEnv.backendUrl}/locations/c821bc0f-85b4-44d5-9bbe-a30cf197c30a`)) {
          connection.mockRespond(new Response(new ResponseOptions(responses.shift())));
        }
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(spyFetchOne).to.have.not.been.called;
      expect(responses).to.have.lengthOf(1);

      component.onLocationClicked(eMock);

      expect(popoverCtrlMock.create).to.have.been.calledOnce;
      expect(popoverCtrlMock.create.args[0][0]).to.eql(LocationDetails);
      expect(popoverCtrlMock.create.args[0][1]).to.eql({ locationId: eMock.target.id });

      expect(popoverMock.present).to.have.calledOnce;
    });

    describe('and initialized', function () {

      let map, panToSpy, setViewSpy;
      beforeEach(function () {

        // The tests in this describe block use a Leaflet map that is manually
        // instantiated here rather than in the view.
        map = L.map('map');
        panToSpy = spy(map, 'panTo');
        setViewSpy = spy(map, 'setView');

        expect(geolocationMock.getCurrentPosition).to.have.not.been.called;
        expect(setViewSpy).to.have.not.been.called;

        expect(component.mapMessage).to.equal(undefined);

        component.onMapReady(map);

        expect(geolocationMock.getCurrentPosition).to.have.been.calledOnce;
        expect(panToSpy).to.have.not.been.called;
        expect(setViewSpy).to.have.been.calledWith([46.183541, 6.100234], 15);
        expect(setViewSpy).to.have.been.calledOnce;

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);
      });

      it('should automatically center the map on the user if in Onex', fakeAsync(function () {

        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expect(panToSpy.args[0]).to.eql([L.latLng(46.18, 6.09), { animate: true }]);
        expect(panToSpy).to.have.been.calledOnce;

        // panTo calls setView
        expect(setViewSpy.args[1]).to.eql([L.latLng(46.18, 6.09), 15, { pan: { animate: true } }]);
        expect(setViewSpy).to.have.been.calledTwice;
      }));

      it('should leave the map centered on Onex if the user is not there', fakeAsync(function () {

        geolocationDeferred.resolve({ coords: { longitude: 8, latitude: 48 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);
        expect(panToSpy).to.have.not.been.called;
        expect(setViewSpy).to.have.been.calledOnce;
      }));

      it('should leave the map centered on Onex if the user cannot be located', fakeAsync(function () {

        geolocationDeferred.reject(new Error('Dunno where you are'));
        tick();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocationError);
        expect(panToSpy).to.have.not.been.called;
        expect(setViewSpy).to.have.been.calledOnce;
      }));

      it('should center the map without changing the zoom level', fakeAsync(function () {

        map.setZoom(10);

        // setZoom calls setView
        expect(setViewSpy.args[1]).to.eql([L.latLng(46.183541, 6.100234), 10, { zoom: undefined }]);
        expect(setViewSpy).to.have.been.calledTwice;

        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expect(panToSpy.args[0]).to.eql([L.latLng(46.18, 6.09), { animate: true }]);
        expect(panToSpy).to.have.been.calledOnce;

        // panTo calls setView
        expect(setViewSpy.args[2]).to.eql([L.latLng(46.18, 6.09), 10, { pan: { animate: true } }]);
        expect(setViewSpy).to.have.been.calledThrice;
      }));

      it('should center the map on the user\'s current position when clicking on the center me button', fakeAsync(function () {

        // Resolve the initial geolocation to somewhere not in Onex.
        geolocationDeferred.resolve({ coords: { longitude: 1, latitude: 0 } });
        tick();

        // The map should not have moved.
        expect(component.mapMessage).to.equal(undefined);
        expect(panToSpy).to.have.not.been.called;
        expect(setViewSpy).to.have.been.calledOnce;

        const currentPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(1).returns(currentPositionDeferred.promise);

        // Click on the button.
        component.centerOnMe();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);

        // Resolve the new geolocation to somewhere else not in Onex.
        currentPositionDeferred.resolve({ coords: { longitude: 24, latitude: 42 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        // The map should have been centered on that position.
        expect(panToSpy.args[0]).to.eql([L.latLng(42, 24), { animate: true }]);
        expect(panToSpy).to.have.been.calledOnce;

        // panTo calls setView
        expect(setViewSpy.args[1]).to.eql([L.latLng(42, 24), 15, { pan: { animate: true } }]);
        expect(setViewSpy).to.have.been.calledTwice;
      }));

      it('should display an error message if geolocation fails after clicking on the center me button', fakeAsync(function () {

        geolocationDeferred.resolve({ coords: { longitude: 1, latitude: 0 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);
        expect(panToSpy).to.have.not.been.called;
        expect(setViewSpy).to.have.been.calledOnce;

        const currentPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(1).returns(currentPositionDeferred.promise);

        component.centerOnMe();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);

        currentPositionDeferred.reject(new Error('Dunno where you are'));
        tick();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocationError);
        expect(panToSpy).to.have.not.been.called;
        expect(setViewSpy).to.have.been.calledOnce;
      }));

      /**
       * This test simulates the following scenario:
       *
       * * The map is displayed, an initial geolocation starts.
       * * The user clicks on the "center on me" button before the initial geolocation has completed. Nothing should happen.
       * * The initial geolocation completes and the map centers on that position.
       *
       * The expected behavior is that the user's click should have no effect.
       * A possible error condition would be that a second geolocation is triggered
       * and the map is centered twice (once as a result of the initial geolocation,
       * and a second time as a result of the user's click).
       */
      it('should center the map on the user\'s initial position when clicking on the center me button before the initial position has been determined', fakeAsync(function () {

        // Mock for the initial geolocation
        const currentPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(1).returns(currentPositionDeferred.promise);

        // Mock for the second geolocation (will not be used when successful, but
        // it must be there to test the error case)
        const nextPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(2).returns(nextPositionDeferred.promise);

        // Click before the initial position has been determined.
        component.centerOnMe();

        // Resolve the initial position.
        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        // The map is correctly centered on the initial position.
        expect(panToSpy.args[0]).to.eql([L.latLng(46.18, 6.09), { animate: true }]);
        expect(panToSpy).to.have.been.calledOnce;

        // panTo calls setView
        expect(setViewSpy.args[1]).to.eql([L.latLng(46.18, 6.09), 15, { pan: { animate: true } }]);
        expect(setViewSpy).to.have.been.calledTwice;

        expect(component.mapMessage).to.equal(undefined);

        // Resolve the second position.
        currentPositionDeferred.resolve({ coords: { longitude: 24, latitude: 42 } });
        tick();

        // Check that nothing happens.
        expect(panToSpy).to.have.been.calledOnce;
        expect(setViewSpy).to.have.been.calledTwice;
        expect(component.mapMessage).to.equal(undefined);
      }));
    });
  });
});
