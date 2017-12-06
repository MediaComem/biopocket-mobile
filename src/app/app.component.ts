import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';

import { fr } from '../locales';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {

  @ViewChild(Nav) nav: Nav;

  activeItem: any;

  rootPage: any;
  menuItems: MenuItem[];

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private translateService: TranslateService) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.menuItems = [
      new MenuItem('map', MapPage, translateService),
      new MenuItem('home', HomePage, translateService)
    ];

    // Set the rootPage in the constructor, so that it could be set dynamically later
    this.rootPage = MapPage;
    // Define the activeMenu 
    this.activeItem = this.menuItems[0];
  }

  /**
   * If the given MenuItem is not already the active one on the menu, its `component` property is set as the app's rootPage
   * and the MenuItem is set as the active menu item.
   * @param {MenuItem} menuItem 
   */
  openPage(menuItem: MenuItem) {
    // Only reset the rootPage if the user clicked on a MenuItem that is not the currently active Item
    if (!this.isActiveItem(menuItem)) {
      this.nav.setRoot(menuItem.component);
      this.activeItem = menuItem;
    }
  }

  /**
   * Checks if the given MenuItem is the currently active MenuItem
   * @param {MenuItem} menuItem
   * @returns {Boolean}
   */
  isActiveItem(menuItem: MenuItem) {
    return menuItem.pageRef === this.activeItem.pageRef;
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

/**
 * This class decorates a Component with a `title` property that returns the properly translated page title.
 * It should be used when adding new items on the `AppComponent.pages` arrray.
 */
class MenuItem {

  /**
   * @constructor
   * @param {String} pageRef A string that is referenced in the `src/locales/fr.yml` file as being a page name
   * @param {any} component The page component to decorate
   * @param {TranslateService} translateService A translate service used by the `title` property
   */
  constructor(public pageRef: string, public component: any, private translateService: TranslateService) {
  }

  /**
   * Returns the page title translated in the current locale, based on the `pageName` property of this `MenuItem`
   */
  get title(): Observable<string> {
    return this.translateService.get(`pages.${this.pageRef}.title`);
  }
}
