import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { translateModuleForRoot } from '../utils/i18n';
import { AppComponent } from './app.component';

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
    LeafletModule.forRoot()
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
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
