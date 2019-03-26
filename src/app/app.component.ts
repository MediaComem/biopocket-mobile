import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Nav, Platform } from 'ionic-angular';
import moment from 'moment';

import { fr } from '@app/locales';

import { MenuItemIcon } from '@classes/menu-item-icon.class';
import { MenuItem } from '@classes/menu-item.class';
import { User } from '@models/user.interface';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { HomePage } from '@pages/home/home';
import { MapPage } from '@pages/map/map';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {

  @ViewChild(Nav) nav: Nav;
  activeItem: MenuItem;
  rootPage: any;
  // This property will probably be removed when users are implemented
  user: User;
  readonly menuItems: MenuItem[];

  constructor(
    private readonly platform: Platform,
    private readonly statusBar: StatusBar,
    private readonly splashScreen: SplashScreen,
    private readonly translateService: TranslateService
  ) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.menuItems = [
      new MenuItem('home', HomePage, new MenuItemIcon('hourglass', 'seabed'), translateService),
      new MenuItem('actionsList', ActionsListPage, new MenuItemIcon('list', 'river'), translateService),
      new MenuItem('map', MapPage, new MenuItemIcon('map', 'warning'), translateService)
    ];

    // Define the active menu item. Its page will be used as the rootPage of the app.
    this.activeItem = this.menuItems[ 2 ];
    // Set the rootPage based on the activeItem. This is only the case when instanciating the app.
    this.rootPage = this.activeItem.component;

    // Dummy user object so that the bip-menu-header can interpolate the data.
    // Should be replace by a proper object containging the user's info.
    this.user = {
      profilePictureUrl: 'https://www.ienglishstatus.com/wp-content/uploads/2018/04/Anonymous-Whatsapp-profile-picture.jpg',
      completeName: 'Guy Fawkes'
    };
  }

  /**
   * If the given MenuItem is not already the active one on the menu, its `component` property is set as the app's rootPage
   * and the MenuItem is set as the active menu item.
   * @param {MenuItem} menuItem The menu item to display.
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
  isActiveItem(menuItem: MenuItem): boolean {
    return menuItem.pageRef === this.activeItem.pageRef;
  }

  menuOpen() {
    this.statusBar.backgroundColorByHexString('#dcdcdc');
  }

  menuClose() {
    this.statusBar.backgroundColorByHexString('#f8f8f8');
  }

  private async initializeApp() {

    moment.locale('fr');

    this.translateService.setTranslation('fr', fr);
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');

    await this.platform.ready();
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    this.statusBar.backgroundColorByHexString('#f8f8f8');
    this.splashScreen.hide();
  }
}
