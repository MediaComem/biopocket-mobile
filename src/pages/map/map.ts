import { ChangeDetectorRef, Component } from '@angular/core';
import { Geolocation, PositionError } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import * as turf from '@turf/turf';
import { NavController, PopoverController, PopoverOptions } from 'ionic-angular';
import * as L from 'leaflet';
import { differenceBy, intersectionBy } from 'lodash';

import { LocationDetails } from '@app/popovers/location-details/location-details';
import { Location } from '@models/location';
import { Marker } from '@models/marker';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { Print } from '@print';
import { LocationsService } from '@providers/locations-service/locations-service';
import { turfPointToLeafletLatLng } from '@utils/geo';
import { defIcon } from '@utils/leafletIcons';
import { PositionErrorValues } from '@utils/position-errors';

const LOG_REF = '[MapPage]';

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
  mapOptions: L.MapOptions;
  layers: Marker[];
  ActionsListPage: any;

  private geolocationInProgress: boolean;

  constructor(
    private readonly geolocation: Geolocation,
    private readonly locationsService: LocationsService,
    private readonly translateService: TranslateService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly popoverCtrl: PopoverController,
    private readonly navCtrl: NavController
  ) {
    this.ActionsListPage = ActionsListPage;
    this.layers = [];
    this.mapOptions = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 19
        })
      ],
      zoomControl: false,
      attributionControl: false
    };
  }

  /**
   * Triggered when the Leaflet map is ready to be accessed and manipulated
   * @param {L.Map} map - The Leaflet map
   */
  onMapReady(map: L.Map) {

    this.map = map;
    this.map.setView([ 46.183541, 6.100234 ], 15);
    this.map.on('moveend', () => this.onMapMoved());

    this.autoCenterMap();

    this.locationsService.fetchAll({ bbox: this.map.getBounds().toBBoxString() })
      .subscribe(locations => this.showLocationsOnMap(locations));
  }

  /**
   * Centers the map on the user's current position (unless geolocation is already in progress).
   */
  centerOnMe() {
    if (this.isGeolocationInProgress()) {
      return;
    }

    this.getCurrentPosition()
      .then(currentPosition => this.centerMap(currentPosition))
      .catch(() => { /* Avoid unhandled promise rejection (warning already logged in getCurrentPosition) */ });
  }

  /**
   * Indicates whether the user is currently being geolocated (which happens when the map is
   * first displayed and every time the user clicks the Center On Me button).
   */
  isGeolocationInProgress(): boolean {
    return this.geolocationInProgress;
  }

  /**
   * React to a click event on a location's marker in the map.
   * This shows a basic Ionic Popover (although ultimately we should create our own compoment) containing the details of the location.
   * This also center the map (or rather the visible part of the map) on the clicked location's marker.
   * @param {L.LeafletMouseEvent} e The event fired by leaflet when a location's marker is clicked
   */
  onLocationClicked(e: L.LeafletMouseEvent) {
    Print.log(`${LOG_REF} - Marker clicked`, e);
    const opt: PopoverOptions = {
      cssClass: 'location-details',
      showBackdrop: true,
      enableBackdropDismiss: true
    };
    const popover = this.popoverCtrl.create(LocationDetails, { locationId: e.target.id }, opt);
    popover.present()
      .then(() => {
        // Yeah... I don't like this way of getting the popover height...
        const locationDetailsEle = document.getElementsByClassName('popover-content')[0] as HTMLElement;
        this.centerViewportOn(e.target._latlng, new L.Point(0, locationDetailsEle.offsetHeight));
      });
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
        this.showLocationsOnMap(toAdd);

        Print.log(`${LOG_REF} New this.layers content`, this.layers);

        // This is to tell Angular that some changes have occured on the component. See the TODO section of DEVELOPMENT.md for more information
        this.changeDetector.detectChanges();
      });
  }

  /**
   * Transforms a Location object into a Marker object, and adds it to the array of currently displayed markers.
   * Also adds a callback to react at a click on the marker.
   */
  private addLocationToMap(location: Location) {
    const coords = location.geometry.coordinates;
    const marker = new Marker(location.id, [ coords[1], coords[0] ], { icon: defIcon });
    marker.on('click', e => this.onLocationClicked(e as L.LeafletMouseEvent));
    this.layers.push(marker);
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
    }).catch(() => { /* Avoid unhandled promise rejection (warning already logged in getCurrentPosition) */ });
  }

  /**
   * Gets the user's current position, displaying a message on the map while it
   * is being determined.
   *
   * @returns {Promise<UserPosition>} A promise which will be resolved with a GeoJSON point feature.
   */
  private getCurrentPosition(): Promise<UserPosition> {

    this.geolocationInProgress = true;
    this.mapMessage = this.translateService.instant('pages.map.geolocation');

    return this.geolocation
      .getCurrentPosition({ timeout: 5000 })
      .then(result => {
        this.setGeolocationDone();
        return turf.point([ result.coords.longitude, result.coords.latitude ]);
      }).catch((err: PositionError) => {
        if (err.code === PositionErrorValues.TIMEOUT.code) {
          this.setGeolocationDone(this.translateService.instant('pages.map.geolocationTimeout'));
        } else {
          this.setGeolocationDone(this.translateService.instant('pages.map.geolocationError'));
        }
        Print.warn('Could not get user position', err);
        return Promise.reject(err);
      });
  }

  /**
   * Centers the map on the specified position.
   *
   * @param {UserPosition} The position to center the map on.
   */
  private centerMap(position: UserPosition) {
    this.map.panTo(turfPointToLeafletLatLng(position), { animate: true });
  }

  /**
   * Marks geolocation as complete and hides the corresponding message on the map.
   */
  private setGeolocationDone(message?: string) {
    this.mapMessage = message;
    this.geolocationInProgress = false;
  }

  /**
   * Centers the map according to the complete viewport, or a subset of it, on the given `location` passed as the first argument.
   * To center the map on a subset of the complete viewport, the `viewportOffset` argument must be passed.
   * The `x` property of the `viewportOffset` argument will be substracted from the right of the width of the complete viewport,
   * while the `y` property will be substracted from the bottom of the height of the viewport.
   * *This method uses only the x/y representation of the Leaflet map.*
   * @param {L.LatLng} location A LatLng that will be used to center the map upon
   * @param {L.Point} viewportOffset An optional Point that contains the width (`x` property) and the height (`y` property) to substract from the viewport.
   */
  private centerViewportOn(location: L.LatLng, viewportOffset?: L.Point) {
    const actualViewportOffset = viewportOffset || new L.Point(0, 0);
    // get the coordinates for the center of the viewport, taking into account the optional offset
    const centerOfViewPort = this.map.getSize().subtract(actualViewportOffset).divideBy(2);
    // convert the LatLng `location` to a Point for further calculation
    const locationPoint = this.map.latLngToContainerPoint(location);
    // Calculate the delta between `location` and the center
    const delta = locationPoint.subtract(centerOfViewPort);
    // Pan the map by the calculated delta so that the given `location` will be at the center of the viewport
    this.map.panBy(delta);
  }

}

