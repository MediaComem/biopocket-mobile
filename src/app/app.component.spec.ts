// Mocha global variables (for Windows)
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ConnectionBackend, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
// import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';
import { IonicModule, Platform } from 'ionic-angular';
import { noop } from 'lodash';
import moment from 'moment';
import { spy, stub } from 'sinon';

import { AppComponent } from '@app/app/app.component';
import { ENV as MockEnv } from '@app/environments/environment.test';
import { fr } from '@app/locales';
import { MenuItem } from '@classes/menu-item.class';
import { StubComponentsModule as ComponentsModule } from '@components/stub-components.module';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { HomePage } from '@pages/home/home';
import { MapPage } from '@pages/map/map';
import { ActionsModule } from '@providers/actions-service/actions-module';
import { EnvService } from '@providers/env-service/env-service';
import { LocationsModule } from '@providers/locations-service/locations-module';
import { expect } from '@spec/chai';
import { createPlatformMock } from '@spec/mocks';
import { asSpy, restoreSpy } from '@spec/sinon';
import { Deferred } from '@spec/utils';
import { translateModuleForRoot } from '@utils/i18n';

describe('AppComponent', () => {
  let fixture;
  let component;
  let httpTestingCtrl: HttpTestingController;

  let platformMock;
  let splashScreenMock;
  let statusBarMock;

  let translateService;

  let readyDeferred;

  beforeEach(() => {

    readyDeferred = new Deferred();

    platformMock = createPlatformMock(mock => {
      mock.ready = stub().resolves(readyDeferred.promise);
    });

    splashScreenMock = {
      hide: spy()
    };

    statusBarMock = {
      styleDefault: spy(),
      backgroundColorByHexString: spy()
    };

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomePage,
        MapPage,
        ActionsListPage
      ],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot(AppComponent),
        MomentModule,
        translateModuleForRoot,
        LeafletModule.forRoot(),
        LocationsModule,
        ComponentsModule,
        ActionsModule
      ],
      providers: [
        Geolocation,
        { provide: Platform, useValue: platformMock },
        { provide: SplashScreen, useValue: splashScreenMock },
        { provide: StatusBar, useValue: statusBarMock },
        Http,
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: EnvService, useValue: MockEnv }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ HomePage, MapPage, ActionsListPage ]
      }
    }).overrideComponent(MapPage, {
      set: {
        // Replacing the map page's template avoids an actual map being rendered. This avoids a lot
        // of things being triggered in the map page (such as fetching locations) so that we don't
        // have to worry about mocking it here.
        // TODO: might be interesting to try and stub the page component (as done for the custom components) instead of overriding the template here.
        template: '<p>Map</p>'
      }
    });
  });

  beforeEach(() => {

    spy(moment, 'locale');

    translateService = TestBed.get(TranslateService);
    spy(translateService, 'setDefaultLang');
    spy(translateService, 'setTranslation');
    spy(translateService, 'use');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    httpTestingCtrl = TestBed.get(HttpTestingController);

    stub(component.nav, 'setRoot');
    stub(component.menuCtrl, 'close');
  });

  afterEach(() => {
    restoreSpy(moment.locale);
    httpTestingCtrl.verify();
  });

  it('should be initialized', async () => {

    // expect(component instanceof AppComponent).to.equal(true);
    expect(component).to.be.an.instanceOf(AppComponent);
    expect(component.menuItems.length).to.equal(3);

    expect(component).to.haveOwnProperty('activeItem');
    expect(component.activeItem).to.be.an.instanceOf(MenuItem);

    // Some initialization should not be done until platform is ready
    expect(splashScreenMock.hide.called, 'splashScreen.hide() called').to.equal(false);
    expect(statusBarMock.styleDefault.called, 'statusBar.styleDefault() called').to.equal(false);
    expect(statusBarMock.backgroundColorByHexString.called, 'statusBar.backgroundColorByHexString() called').to.equal(false);

    expect(asSpy(moment.locale).args, 'moment.locale() called').to.eql([['fr']]);

    expect(translateService.setDefaultLang.args, 'translateService.setDefaultLang() called').to.eql([['fr']]);
    expect(translateService.setTranslation.args, 'translateService.setTranslation() called').to.eql([[ 'fr', fr ]]);
    expect(translateService.use.args, 'translateService.use() called').to.eql([['fr']]);
  });

  it('should perform further initialization when the platform is ready', fakeAsync(() => {

    readyDeferred.resolve('READY');
    tick();

    expect(splashScreenMock.hide, 'splashScreen.hide() called').to.have.callCount(1);
    expect(statusBarMock.styleDefault, 'statusBar.styleDefault() called').to.have.callCount(1);
    expect(statusBarMock.backgroundColorByHexString, 'statusBar.backgroundColorByHexString() called').to.have.been.calledWith('#f8f8f8');
  }));

  describe('#menuOpen', () => {
    it("should change the statusBar's background color", function() {
      component.menuOpen();
      expect(statusBarMock.backgroundColorByHexString).to.have.been.calledWith('#dcdcdc');
    });
  });

  describe('#menuClose', () => {
    it("should change back the statusBar's background color", function() {
      component.menuClose();
      expect(statusBarMock.backgroundColorByHexString).to.have.been.calledWith('#f8f8f8');
    });
  });

  describe('#openMenuItemPage', () => {
    it('should navigate to the page\'s component', function() {

      const pageComponentMock = noop;

      component.openMenuItemPage({
        title: 'Foo',
        component: pageComponentMock
      });

      expect(component.nav.setRoot, 'nav.setRoot() called once with the page\'s component').to.have.been.calledWith(pageComponentMock);
    });
  });

  describe('#openPage', () => {
    it('should navigate to the given page', function() {
      const pageFake = noop;

      component.openPage(pageFake);

      expect(component.nav.setRoot).to.have.been.calledWith(pageFake);
      expect(component.activeItem).to.eqls(pageFake);
      expect(component.menuCtrl.close).to.have.callCount(1);
    });
  });
});
