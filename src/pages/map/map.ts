import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as L from 'leaflet';

@Component({
  selector: 'map-page',
  templateUrl: 'map.html'
})
export class MapPage {
  map: L.Map;
  mapOptions: Object;

  constructor(public navCtrl: NavController) {
    this.mapOptions = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
          maxZoom: 18
        })
      ]
    }
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.map.setView([51.505, -0.09], 13);
  }
}