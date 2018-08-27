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
import MenuItem from '@classes/menu-item.class';
import { StubComponentsModule as ComponentsModule } from '@components/stub-components.module';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import { HomePage } from '@pages/home/home';
import { MapPage } from '@pages/map/map';
import ActionsModule from '@providers/actions-service/actions-module';
import EnvService from '@providers/env-service/env-service';
import LocationsModule from '@providers/locations-service/locations-module';
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

  beforeEach(async () => {

    readyDeferred = new Deferred();

    platformMock = createPlatformMock(mock => {
      mock.ready = stub().resolves(readyDeferred.promise);
    });

    splashScreenMock = {
      hide: spy()
    };

    statusBarMock = {
      styleDefault: spy()
    };

    await TestBed.configureTestingModule({
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

    expect(asSpy(moment.locale).args, 'moment.locale() called').to.eql([ [ 'fr' ] ]);

    expect(translateService.setDefaultLang.args, 'translateService.setDefaultLang() called').to.eql([ [ 'fr' ] ]);
    expect(translateService.setTranslation.args, 'translateService.setTranslation() called').to.eql([ [ 'fr', fr ] ]);
    expect(translateService.use.args, 'translateService.use() called').to.eql([ [ 'fr' ] ]);
  });

  it('should perform further initialization when the platform is ready', fakeAsync(() => {

    readyDeferred.resolve('READY');
    tick();

    expect(splashScreenMock.hide.args, 'splashScreen.hide() called').to.eql([ [] ]);
    expect(statusBarMock.styleDefault.args, 'statusBar.styleDefault() called').to.eql([ [] ]);
  }));

  describe('#openPage', () => {
    it('should navigate to the page\'s component', () => {

      const pageComponentMock = noop;

      component.openPage({
        title: 'Foo',
        component: pageComponentMock
      });

      expect(component.nav.setRoot.args, 'nav.setRoot() called once with the page\'s component').to.eql([ [ pageComponentMock ] ]);
    });
  });
});
