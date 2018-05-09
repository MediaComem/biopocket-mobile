import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import ApiService from "../../providers/api-service/api-service";

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ApiService
  ]
})
export default class ApiModule { };
