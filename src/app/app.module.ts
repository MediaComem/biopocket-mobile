import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import LocationDetails from '../popovers/location-details/location-details';
import { ApiInterceptor } from '../providers/api-interceptor/api-interceptor';
import LocationsModule from '../providers/locations-service/locations-module';
import EnvService from '../providers/env-service/env-service';
import { translateModuleForRoot } from '../utils/i18n';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    MapPage,
    LocationDetails
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
    MapPage,
    LocationDetails
  ],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    EnvService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
