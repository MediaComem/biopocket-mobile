import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import * as L from 'leaflet';
import { intersectionBy, differenceBy } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import * as turf from '@turf/turf';

import { Location } from '../../models/location';
import Marker from '../../models/marker';
import LocationsService from '../../providers/locations-service/locations-service';
import { turfPointToLeafletLatLng } from '../../utils/geo';
import { defIcon } from '../../utils/leafletIcons';
import Print from '../../utils/print';

const LOG_REF: string = "[MapPage]";

const ONEX_SOUTH_WEST = turf.point([ 6.086417, 46.173987 ]);
const ONEX_NORTH_EAST = turf.point([ 6.112753, 46.196898 ]);
const ONEX_BBOX = turf.bboxPolygon(turf.bbox(turf.featureCollection([ ONEX_SOUTH_WEST, ONEX_NORTH_EAST ])));

type UserPosition = turf.Feature<turf.Point>;

@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {

  map: L.Map;
  mapMessage: string;
  mapOptions: Object;
  layers: Marker[] = [];

  private geolocationInProgress: boolean;

  constructor(
    private geolocation: Geolocation,
    private locationsService: LocationsService,
    private translateService: TranslateService
  ) {
    this.mapOptions = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 19
        })
      ]
    };
  }

  /**
   * Triggered when the Leaflet map is ready to be accessed and manipulated
   * @param {L.Map} map - The Leaflet map
   */
  onMapReady(map: L.Map) {

    this.map = map;
    this.map.setView([46.183541, 6.100234], 15);
    this.map.on('moveend', () => this.onMapMoved());

    this.autoCenterMap();

    this.locationsService.fetchAll({ bbox: this.map.getBounds().toBBoxString() })
      .subscribe(locations => this.showLocationsOnMap(locations));
  }

  /**
   * Centers the map on the user's current position (unless geolocation is already in progress).
   */
  centerOnMe() {
    if (!this.isGeolocationInProgress()) {
      this.getCurrentPosition().then(currentPosition => this.centerMap(currentPosition));
    }
  }

  /**
   * Indicates whether the user is currently being geolocated (which happens when the map is
   * first displayed and every time the user clicks the Center On Me button).
   */
  isGeolocationInProgress(): boolean {
    return this.geolocationInProgress;
  }

  /**
   * Create a marker for each of the Location, and add it to the map
   * @param {Location[]} locations - An array of Location objects
   */
  private showLocationsOnMap(locations: Location[]) {
    locations.forEach(location => this.addLocationToMap(location));
  }

  /**
   * Triggered each time the leaflet map stops being moved by the user.
   */
  private onMapMoved() {
    this.locationsService.fetchAll({ bbox: this.map.getBounds().toBBoxString() })
      .subscribe(res => {
        const remaining: Marker[] = intersectionBy(this.layers, res, 'id');
        const toAdd: Location[] = differenceBy(res, this.layers, 'id');

        Print.log(`${LOG_REF} onMapMoved - remaining`, remaining, 'toAdd', toAdd);

        this.layers = remaining;
        toAdd.forEach(location => this.addLocationToMap(location));

        Print.log(`${LOG_REF} New this.layers content`, this.layers);
      });
  }

  /**
   * Transforms a Location object into a Marker object, and adds it to the array of currently displayed markers
   */
  private addLocationToMap(location: Location) {
    this.layers.push(new Marker(location.id, location.geometry.coordinates, { icon: defIcon }));
  }

  /**
   * Center the map on the user's current position if in Onex
   * (otherwise remain at the default position).
   */
  private autoCenterMap() {
    this.getCurrentPosition().then(currentPosition => {
      if (turf.inside(currentPosition, ONEX_BBOX)) {
        this.centerMap(currentPosition);
      }
    }).catch(() => { /* do nothing */ });
  }

  /**
   * Gets the user's current position, displaying a message on the map while it
   * is being determined.
   *
   * @param {function} [action] - An optional action to execute once the position is available.
   * @returns {Promise<UserPosition>} A GeoJSON point feature.
   */
  private getCurrentPosition(): Promise<UserPosition> {

    this.geolocationInProgress = true;
    this.mapMessage = this.translateService.instant('pages.map.geolocation');

    return this.geolocation
      .getCurrentPosition()
      .then(result => {
        this.setGeolocationDone();
        return turf.point([ result.coords.longitude, result.coords.latitude ]);
      }, err => {
        this.setGeolocationDone();
        Print.warn('Could not get user position', err);
        return Promise.reject(err);
      });
  }

  /**
   * Centers the map on the specified position at zoom level 15.
   *
   * @param {UserPosition} The position to center the map on.
   */
  private centerMap(position: UserPosition) {
    this.map.setView(turfPointToLeafletLatLng(position), 15, { animate: true });
  }

  /**
   * Marks geolocation as complete and hides the corresponding message on the map.
   */
  private setGeolocationDone() {
    this.mapMessage = undefined;
    this.geolocationInProgress = false;
  }

}
