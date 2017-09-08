import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MomentModule } from 'angular2-moment';
import { expect } from 'chai';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { spy, stub } from 'sinon';

import { createPlatformMock, locales } from '../../spec/mocks';
import { Deferred, restoreSpyOrStub } from '../../spec/utils';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { translateModuleForRoot } from '../utils/i18n';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture;
  let component;

  let platformMock;
  let splashScreenMock;
  let statusBarMock;
  let translateService;

  let readyDeferred;

  beforeEach(async(() => {

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

    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomePage,
        ListPage
      ],
      imports: [
        IonicModule.forRoot(AppComponent),
        MomentModule,
        translateModuleForRoot
      ],
      providers: [
        { provide: Platform, useValue: platformMock },
        { provide: SplashScreen, useValue: splashScreenMock },
        { provide: StatusBar, useValue: statusBarMock }
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ HomePage, ListPage ],
      }
    });
  }));

  beforeEach(() => {

    spy(moment, 'locale');

    translateService = TestBed.get(TranslateService);
    spy(translateService, 'setDefaultLang');
    spy(translateService, 'setTranslation');
    spy(translateService, 'use');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    stub(component.nav, 'setRoot');
  });

  afterEach(() => {
    restoreSpyOrStub(moment.locale);
  });

  it('should be initialized', async () => {

    expect(component instanceof AppComponent).to.equal(true);
    expect(component.pages.length).to.equal(2);

    // Some initialization should not be done until platform is ready
    expect(splashScreenMock.hide.called, 'splashScreen.hide called').to.equal(false);
    expect(statusBarMock.styleDefault.called, 'statusBar.styleDefault called').to.equal(false);

    expect(moment.locale['args'], 'moment.locale called').to.eql([ [ 'fr' ] ]);

    expect(translateService.setDefaultLang.args, 'translateService.setDefaultLang called').to.eql([ [ 'fr' ] ]);
    expect(translateService.setTranslation.args, 'translateService.setTranslation called').to.eql([ [ 'fr', locales.fr ] ]);
    expect(translateService.use.args, 'translateService.use called').to.eql([ [ 'fr' ] ]);

    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('ion-title'));
    expect(title.nativeElement.textContent).to.equal(locales.fr.app);
  });

  it('should perform further initialization when the platform is ready', async () => {

    readyDeferred.resolve('READY');
    await readyDeferred.promise;

    expect(splashScreenMock.hide.args, 'splashScreen.hide() called').to.eql([ [] ]);
    expect(statusBarMock.styleDefault.args, 'statusBar.styleDefault() called').to.eql([ [] ]);
  });

  describe('#openPage', () => {
    it('should navigate to the page\'s component', () => {

      const pageComponentMock = function() {};

      component.openPage({
        title: 'Foo',
        component: pageComponentMock
      });

      expect(component.nav.setRoot.args, 'nav.setRoot() called once with the page\'s component').to.eql([ [ pageComponentMock ] ]);
    });
  });
});
