import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { IonicStorageModule } from '@ionic/storage';
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
import { LoginModal } from '@pages/login-modal/login-modal';
import { MapPage } from '@pages/map/map';
import { ThemePage } from '@pages/theme/theme';
import { ActionsService } from '@providers/actions-service/actions-service';
import { ApiInterceptor } from '@providers/api-interceptor/api-interceptor';
import { EnvService } from '@providers/env-service/env-service';
import { LocationsService } from '@providers/locations-service/locations-service';
import { translateModuleForRoot } from '@utils/i18n';
import { AuthService } from '../providers/auth-service/auth-service';
import { AppComponent } from './app.component';

const components = [
  AppComponent,
  ActionsListPage,
  HomePage,
  LocationDetails,
  MapPage,
  ActionPage,
  ThemePage,
  LoginModal
];

@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    ComponentsModule,
    DirectivesModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(AppComponent),
    IonicStorageModule.forRoot(),
    LeafletModule.forRoot(),
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          headerIds: false
        }
      }
    }),
    MomentModule,
    RegistrationModule,
    translateModuleForRoot
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: components,
  providers: [
    ActionsService,
    LocationsService,
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
    },
    AuthService
  ]
})
export class AppModule { }
