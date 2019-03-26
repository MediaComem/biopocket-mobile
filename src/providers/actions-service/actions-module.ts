import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ActionsService } from './actions-service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    ActionsService
  ]
})
export class ActionsModule { }
