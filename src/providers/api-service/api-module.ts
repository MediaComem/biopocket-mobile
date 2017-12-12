import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { RequestBuilderModule } from "ng-request-builder";

import ApiService from "../../providers/api-service/api-service";

@NgModule({
  imports: [
    RequestBuilderModule,
    HttpModule
  ],
  providers: [
    ApiService
  ]
})
export default class ApiModule { };