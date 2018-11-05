import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MomentModule } from 'angular2-moment';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import LocationDetails from '@app/popovers/location-details/location-details';
import { ComponentsModule } from '@components/components.module';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { HomePage } from '@pages/home/home';
import { MapPage } from '@pages/map/map';
import ActionsServiceProvider from '@providers/actions-service/actions-module';
import { ApiInterceptor } from '@providers/api-interceptor/api-interceptor';
import EnvService from '@providers/env-service/env-service';
import LocationsModule from '@providers/locations-service/locations-module';
import { translateModuleForRoot } from '@utils/i18n';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ActionsListPage,
    HomePage,
    LocationDetails,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    MomentModule,
    translateModuleForRoot,
    LeafletModule.forRoot(),
    LocationsModule,
    ActionsServiceProvider,
    ComponentsModule
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AppComponent,
    ActionsListPage,
    HomePage,
    LocationDetails,
    MapPage
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
