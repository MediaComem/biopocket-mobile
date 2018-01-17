import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as L from 'leaflet';
import { intersectionBy, differenceBy } from 'lodash';

import { Location } from '../../models/location';
import LocationsService from '../../providers/locations-service/locations-service';
import { defIcon } from '../../utils/leafletIcons';
import Print from '../../utils/print';
import Marker from '../../models/marker';

const LOG_REF: string = "[MapPage]";

@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {

  map: L.Map;
  mapOptions: Object;
  layers: Marker[] = [];

  constructor(public navCtrl: NavController, private locationsService: LocationsService) {
    this.mapOptions = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 19
        })
      ]
    }
  }

  /**
   * Triggered when the Leaflet map is ready to be accessed and manipulated
   * @param {L.Map} map - The Leaflet map 
   */
  onMapReady(map: L.Map) {
    this.map = map;
    this.map.setView([46.183541, 6.100234], 15);
    this.map.on('moveend', () => this.onMapMoved());

    this.locationsService.fetchAll({ bbox: this.map.getBounds().toBBoxString() })
      .subscribe(locations => this.showLocationsOnMap(locations));
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

}