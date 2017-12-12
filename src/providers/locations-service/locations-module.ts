import { NgModule } from "@angular/core";

import LocationsService from "../../providers/locations-service/locations-service";
import ApiModule from "../../providers/api-service/api-module";

@NgModule({
  imports: [
    ApiModule
  ],
  providers: [
    LocationsService
  ]
})
export default class LocationsModule { }
