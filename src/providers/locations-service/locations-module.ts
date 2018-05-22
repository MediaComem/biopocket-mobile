import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import LocationsService from '../../providers/locations-service/locations-service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    LocationsService
  ]
})
export default class LocationsModule { }
