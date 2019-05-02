import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, ModalController, Nav, Platform } from 'ionic-angular';
import moment from 'moment';

import { fr } from '@app/locales';

import { MenuItem } from '@models/menu-item';
import { MenuItemIcon } from '@models/menu-item-icon';
import { User } from '@models/user.interface';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { HomePage } from '@pages/home/home';
import { LoginModal } from '@pages/login-modal/login-modal';
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
    private readonly translateService: TranslateService,
    private readonly menuCtrl: MenuController,
    private readonly modalCtrl: ModalController
  ) {

    this.initializeApp();

    this.menuItems = [
      new MenuItem('home', HomePage, new MenuItemIcon('hourglass', 'seabed'), translateService),
      new MenuItem('actionsList', ActionsListPage, new MenuItemIcon('list', 'river'), translateService),
      new MenuItem('map', MapPage, new MenuItemIcon('map', 'warning'), translateService)
    ];

    // Define the active menu item. Its page will be used as the rootPage of the app.
    this.activeItem = this.menuItems[0];
    // Set the rootPage based on the activeItem. This is only the case when instanciating the app.
    this.rootPage = this.activeItem.component;

    // Dummy user object so that the bip-menu-header can interpolate the data.
    // Should be replace by a proper object containging the user's info.
    this.user = {
      profilePictureUrl: 'assets/img/default_profile.jpg',
      completeName: 'BioPocket'
    };
  }

  /**
   * Sets the given page component or MenuItem page as the app's root page.
   * If the given MenuItem is not already the active one on the menu, its `component` property is set as the app's root page.
   * and the MenuItem is set as the active menu item.
   * If you pass it a page, the page itself is set as the app's root page and as the active item.
   * @param pageOrMenuItem A page component or one of the MenuItem.
   */
  openPage(pageOrMenuItem: any | MenuItem) {
    if (pageOrMenuItem instanceof MenuItem) {
      if (!this.isActiveItem(pageOrMenuItem)) {
        this.nav.setRoot(pageOrMenuItem.component);
        this.activeItem = pageOrMenuItem;
      }
    } else {
      this.nav.setRoot(pageOrMenuItem);
      this.activeItem = pageOrMenuItem;
      this.menuCtrl.close();
    }
  }

  presentLoginModal() {
    const loginModal = this.modalCtrl.create(LoginModal, {}, {
      cssClass: 'login-modal'
    });
    loginModal.present();
  }

  /**
   * Checks if the given MenuItem is the currently active MenuItem
   * @param {MenuItem} menuItem
   * @returns {Boolean}
   */
  isActiveItem(menuItem: MenuItem): boolean {
    return menuItem.pageRef === this.activeItem.pageRef;
  }

  /**
   * Is called each time the side-menu is open.
   * Currently only changes the status bar background color.
   */
  menuOpen() {
    this.statusBar.backgroundColorByHexString('#dcdcdc');
  }

  /**
   * Is called each time the side-menu is closed.
   * Currently only changes the status bar background color.
   */
  menuClose() {
    this.statusBar.backgroundColorByHexString('#f8f8f8');
  }

  /**
   * Proceed to app initialization:
   * * Configure the locale for moment and the translation service.
   * * Configure the status bar behavior.
   */
  private async initializeApp() {

    moment.locale('fr');

    // TODO: replace with code that fetch the locale from the device.
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
