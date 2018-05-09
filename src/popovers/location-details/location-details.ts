import { Component } from "@angular/core";
import { ViewController, NavParams } from "ionic-angular";

import LocationsService from "../../providers/locations-service/locations-service";
import { Location } from "../../models";

@Component({
  templateUrl: 'location-details.html'
})
export default class LocationDetails {

  public location: Location;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private locationsService: LocationsService
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