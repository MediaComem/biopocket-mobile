import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { spy, stub } from 'sinon';

import { createPlatformMock } from '../../spec/mocks';
import { Deferred } from '../../spec/utils';
import { AppComponent } from './app.component';

describe('AppComponent Component', () => {
  let fixture;
  let component;

  let platformMock;
  let splashScreenMock;
  let statusBarMock;

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
      declarations: [ AppComponent ],
      imports: [
        IonicModule.forRoot(AppComponent)
      ],
      providers: [
        { provide: Platform, useValue: platformMock },
        { provide: SplashScreen, useValue: splashScreenMock },
        { provide: StatusBar, useValue: statusBarMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    stub(component.nav, 'setRoot');
  });

  it('should be initialized', async () => {

    expect(component instanceof AppComponent).to.equal(true);
    expect(component.pages.length).to.equal(2);

    const title = fixture.debugElement.query(By.css('ion-title'));
    expect(title.nativeElement.textContent).to.equal('BioPocket');

    // Initialization should not be done until platform is ready
    expect(splashScreenMock.hide.called, 'splashScreen.hide() called').to.equal(false);
    expect(statusBarMock.styleDefault.called, 'statusBar.styleDefault() called').to.equal(false);
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
