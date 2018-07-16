import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Location } from '@models/location';
import LocationsService from '@providers/locations-service/locations-service';

@Component({
  templateUrl: 'location-details.html'
})
export default class LocationDetails {

  location: Location;

  constructor(
    private readonly viewCtrl: ViewController,
    private readonly navParams: NavParams,
    private readonly locationsService: LocationsService
  ) { }

  ngOnInit() {
    this.locationsService.fetchOne(this.navParams.data.locationId).subscribe(location => {
      this.location = location;
    });
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
