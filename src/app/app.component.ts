import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import * as fr from '../../locales/fr.json';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: MenuPage[];

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private translateService: TranslateService) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      new MenuPage('home', HomePage, translateService),
      new MenuPage('list', ListPage, translateService)
    ];
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private initializeApp() {

    moment.locale('fr');

    this.translateService.setTranslation('fr', fr);
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

class MenuPage {
  constructor(public pageName: string, public component: any, private translateService: TranslateService) {
  }

  get title(): Observable<string> {
    return this.translateService.get(`pages.${this.pageName}.title`);
  }
}
