import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// RXJS Operators
import './rxjs';

import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { translateModuleForRoot } from '../utils/i18n';
import { AppComponent } from './app.component';
import LocationsModule from '../providers/locations-service/locations-module';
import EnvService from '../providers/env-service/env-service';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    MomentModule,
    translateModuleForRoot,
    LeafletModule.forRoot(),
    LocationsModule
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AppComponent,
    HomePage,
    MapPage
  ],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EnvService
  ]
})
export class AppModule { }
