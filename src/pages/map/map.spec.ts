// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed } from '@angular/core/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { expect } from 'chai';
import { IonicModule, NavController } from 'ionic-angular';
import * as L from 'leaflet';

import { translateModuleForRoot } from '../../utils/i18n';
import { MapPage } from './map';

describe('MapPage', function () {
  let component;
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
        LeafletModule.forRoot()
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock }
      ]
    });

  });

  afterEach(function () {
    component = null;
  });

  it('should be created', function () {
    component = TestBed.createComponent(MapPage).componentInstance;
    expect(component).to.be.an.instanceOf(MapPage);
  });

  it('should have a valid mapOptions property', function () {
    component = TestBed.createComponent(MapPage).componentInstance;
    expect(component, 'MapPage has no mapOptions property').to.haveOwnProperty('mapOptions');
    expect(component.mapOptions, 'MapPage.mapOptions has no layers property').to.haveOwnProperty('layers');
    expect(component.mapOptions.layers, 'MapPage.mapOptions.layers is not an array').to.be.an('array');
    component.mapOptions.layers.forEach(layer => {
      expect(layer).to.be.an.instanceOf(L.TileLayer);
    });
  });
});