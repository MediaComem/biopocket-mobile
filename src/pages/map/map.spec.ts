// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController, PopoverController } from 'ionic-angular';
import * as L from 'leaflet';
import { spy, stub } from 'sinon';

import { ENV as MockEnv } from '@app/environments/environment.test';
import { fr } from '@app/locales';
import LocationDetails from '@app/popovers/location-details/location-details';
import { BipIconStub } from '@components/bip-icon/bip-icon.stub';
import Marker from '@models/marker';
import { MapPage } from '@pages/map/map';
import EnvService from '@providers/env-service/env-service';
import locationsDataMock from '@providers/locations-service/locations-data.mock';
import LocationsModule from '@providers/locations-service/locations-module';
import LocationsService from '@providers/locations-service/locations-service';
import { expect } from '@spec/chai';
import { resetStub } from '@spec/sinon';
import { Deferred } from '@spec/utils';
import { translateModuleForRoot } from '@utils/i18n';
import { observableOf, observableThatThrows } from '@utils/observable';

type LocationsServiceMock = Partial<LocationsService>;

describe('MapPage', function () {
  let component, fixture;
  let httpTestingCtrl: HttpTestingController;
  let geolocationMock, geolocationDeferred;
  let navControllerMock;
  let popoverCtrlMock, popoverMock;
  let locationsServiceMock: LocationsServiceMock;

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

    locationsServiceMock = {
      fetchAll: stub().returns(observableOf([])),
      fetchOne: stub().returns(observableThatThrows('No result mocked for fetchOne'))
    };

    navControllerMock = {};

    TestBed.configureTestingModule({
      declarations: [
        MapPage,
        BipIconStub
      ],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot(MapPage),
        translateModuleForRoot,
        LeafletModule.forRoot(),
        LocationsModule
      ],
      providers: [
        { provide: Geolocation, useValue: geolocationMock },
        { provide: NavController, useValue: navControllerMock },
        { provide: EnvService, useValue: MockEnv },
        { provide: PopoverController, useValue: popoverCtrlMock },
        { provide: LocationsService, useValue: locationsServiceMock }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;

    httpTestingCtrl = TestBed.get(HttpTestingController);
  });

  afterEach(function () {
    // Make sure no HTTP requests were made during these tests (services should be mocked).
    httpTestingCtrl.verify();
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

      resetStub(locationsServiceMock.fetchAll).returns(observableOf(locationsDataMock));

      expect(component.layers).to.be.an('array');
      expect(component.layers).to.have.length(0);

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.layers).to.have.length(3);
      component.layers.forEach((marker, pos) => {
        expect(marker).to.be.an.instanceOf(Marker);

        const latLng = marker.getLatLng();
        expect(latLng.lat).to.equal(locationsDataMock[pos].geometry.coordinates[1]);
        expect(latLng.lng).to.equal(locationsDataMock[pos].geometry.coordinates[0]);
      });
    });

    it('should reload locations after the map has been panned', async function () {

      resetStub(locationsServiceMock.fetchAll, fetchAll => {
        fetchAll.onCall(0).returns(observableOf(locationsDataMock.slice(0, 2)));
        fetchAll.onCall(1).returns(observableOf(locationsDataMock.slice(1)));
      });

      fixture.detectChanges();
      await fixture.whenStable();

      expect(locationsServiceMock.fetchAll).to.have.callCount(1);
      expect(component.layers).to.have.length(2);

      let markerIds = component.layers.map(marker => marker.id);
      let expectedIds = locationsDataMock.slice(0, 2).map(location => location.id);

      expect(markerIds).to.have.members(expectedIds);

      component.map.setView([ 12, 4 ], 15);

      const callOptions = {
        bbox: component.map.getBounds().toBBoxString()
      };

      fixture.detectChanges();
      await fixture.whenStable();

      expect(locationsServiceMock.fetchAll).to.have.callCount(2);
      expect(locationsServiceMock.fetchAll).to.have.been.calledWith(callOptions);

      markerIds = component.layers.map(marker => marker.id);
      expectedIds = locationsDataMock.slice(1).map(location => location.id);

      expect(markerIds).to.have.members(expectedIds);
    });

    it('should open a Popover when a location\'s marker is clicked', async function () {

      resetStub(locationsServiceMock.fetchAll, fetchAll => {
        fetchAll.returns(observableOf(locationsDataMock));
      });

      const eMock = {
        target: {
          id: locationsDataMock[0].id,
          _latlng: new L.LatLng(56, 9)
        }
      };

      fixture.detectChanges();
      await fixture.whenStable();

      expect(locationsServiceMock.fetchOne).to.have.callCount(0);

      component.onLocationClicked(eMock);

      expect(popoverCtrlMock.create).to.have.callCount(1);
      expect(popoverCtrlMock.create.args[0]).to.have.lengthOf(3);
      expect(popoverCtrlMock.create.args[0][0]).to.eql(LocationDetails);
      expect(popoverCtrlMock.create.args[0][1]).to.eql({ locationId: eMock.target.id });
      expect(popoverCtrlMock.create.args[ 0 ][ 2 ]).to.be.an('object');

      expect(popoverMock.present).to.have.callCount(1);
    });

    describe('and initialized', function () {

      let map, panToSpy, setViewSpy;
      function setUpMap(options = {}) {

        // The tests in this describe block use a Leaflet map that is manually
        // instantiated here rather than in the view.
        map = L.map('map', options);
        panToSpy = spy(map, 'panTo');
        setViewSpy = spy(map, 'setView');

        expect(geolocationMock.getCurrentPosition).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(0);

        expect(component.mapMessage).to.equal(undefined);

        component.onMapReady(map);

        expect(geolocationMock.getCurrentPosition).to.have.callCount(1);
        expect(panToSpy).to.have.callCount(0);
        expect(setViewSpy).to.have.been.calledWith([ 46.183541, 6.100234 ], 15);
        expect(setViewSpy).to.have.callCount(1);

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);
      }

      it('should automatically center the map on the user if in Onex', fakeAsync(function () {
        setUpMap();

        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expect(panToSpy.args[ 0 ]).to.eql([ L.latLng(46.18, 6.09), { animate: true } ]);
        expect(panToSpy).to.have.callCount(1);

        // panTo calls setView
        expect(setViewSpy.args[ 1 ]).to.eql([ L.latLng(46.18, 6.09), 15, { pan: { animate: true } } ]);
        expect(setViewSpy).to.have.callCount(2);
      }));

      it('should leave the map centered on Onex if the user is not there', fakeAsync(function () {
        setUpMap();

        geolocationDeferred.resolve({ coords: { longitude: 8, latitude: 48 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);
        expect(panToSpy).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(1);
      }));

      it('should leave the map centered on Onex if the user cannot be located', fakeAsync(function () {
        setUpMap();

        geolocationDeferred.reject(new Error('Dunno where you are'));
        tick();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocationError);
        expect(panToSpy).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(1);
      }));

      it('should center the map without changing the zoom level', fakeAsync(function () {
        setUpMap({ zoom: 10 });

        geolocationDeferred.resolve({ coords: { longitude: 6.09, latitude: 46.18 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);

        expect(panToSpy.args[ 0 ]).to.eql([ L.latLng(46.18, 6.09), { animate: true } ]);
        expect(panToSpy).to.have.callCount(1);

        // panTo calls setView
        expect(setViewSpy.args[ 1 ]).to.eql([ L.latLng(46.18, 6.09), 15, { pan: { animate: true } } ]);
        expect(setViewSpy).to.have.callCount(2);
      }));

      it('should center the map on the user\'s current position when clicking on the center me button', fakeAsync(function () {
        setUpMap();

        // Resolve the initial geolocation to somewhere not in Onex.
        geolocationDeferred.resolve({ coords: { longitude: 1, latitude: 0 } });
        tick();

        // The map should not have moved.
        expect(component.mapMessage).to.equal(undefined);
        expect(panToSpy).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(1);

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
        expect(panToSpy.args[ 0 ]).to.eql([ L.latLng(42, 24), { animate: true } ]);
        expect(panToSpy).to.have.callCount(1);

        // panTo calls setView
        expect(setViewSpy.args[ 1 ]).to.eql([ L.latLng(42, 24), 15, { pan: { animate: true } } ]);
        expect(setViewSpy).to.have.callCount(2);
      }));

      it('should display an error message if geolocation fails after clicking on the center me button', fakeAsync(function () {
        setUpMap();

        geolocationDeferred.resolve({ coords: { longitude: 1, latitude: 0 } });
        tick();

        expect(component.mapMessage).to.equal(undefined);
        expect(panToSpy).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(1);

        const currentPositionDeferred = new Deferred();
        geolocationMock.getCurrentPosition.onCall(1).returns(currentPositionDeferred.promise);

        component.centerOnMe();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocation);

        currentPositionDeferred.reject(new Error('Dunno where you are'));
        tick();

        expect(component.mapMessage).to.equal(fr.pages.map.geolocationError);
        expect(panToSpy).to.have.callCount(0);
        expect(setViewSpy).to.have.callCount(1);
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
        setUpMap();

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
        expect(panToSpy.args[ 0 ]).to.eql([ L.latLng(46.18, 6.09), { animate: true } ]);
        expect(panToSpy).to.have.callCount(1);

        // panTo calls setView
        expect(setViewSpy.args[ 1 ]).to.eql([ L.latLng(46.18, 6.09), 15, { pan: { animate: true } } ]);
        expect(setViewSpy).to.have.callCount(2);

        expect(component.mapMessage).to.equal(undefined);

        // Resolve the second position.
        currentPositionDeferred.resolve({ coords: { longitude: 24, latitude: 42 } });
        tick();

        // Check that nothing happens.
        expect(panToSpy).to.have.callCount(1);
        expect(setViewSpy).to.have.callCount(2);
        expect(component.mapMessage).to.equal(undefined);
      }));
    });
  });
});
