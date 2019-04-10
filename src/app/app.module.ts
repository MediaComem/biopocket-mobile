import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Clipboard } from '@ionic-native/clipboard';
import { Geolocation } from '@ionic-native/geolocation';
import { Globalization } from '@ionic-native/globalization';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { MomentModule } from 'angular2-moment';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

import { RegistrationModule } from '@app/modules/registration/registration.module';
import { LocationDetails } from '@app/popovers/location-details/location-details';
import { ComponentsModule } from '@components/components.module';
import { DirectivesModule } from '@directives/directives.module';
import { ActionPage } from '@pages/action/action';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { HomePage } from '@pages/home/home';
import { MapPage } from '@pages/map/map';
import { ThemePage } from '@pages/theme/theme';
import { ActionsModule } from '@providers/actions-service/actions-module';
import { ApiInterceptor } from '@providers/api-interceptor/api-interceptor';
import { EnvService } from '@providers/env-service/env-service';
import { LocationsModule } from '@providers/locations-service/locations-module';
import { translateModuleForRoot } from '@utils/i18n';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ActionsListPage,
    HomePage,
    LocationDetails,
    MapPage,
    ActionPage,
    ThemePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent),
    MomentModule,
    translateModuleForRoot,
    LeafletModule.forRoot(),
    LocationsModule,
    ActionsModule,
    ComponentsModule,
    DirectivesModule,
    FormsModule,
    RegistrationModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          headerIds: false
        }
      }
    })
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    AppComponent,
    ActionsListPage,
    HomePage,
    LocationDetails,
    MapPage,
    ActionPage,
    ThemePage
  ],
  providers: [
    Toast,
    Clipboard,
    Geolocation,
    Globalization,
    StatusBar,
    SplashScreen,
    YoutubeVideoPlayer,
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
