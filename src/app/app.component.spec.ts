import { async, TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { spy } from 'sinon';

import { createPlatformMock } from '../../spec/mocks';
import { AppComponent } from './app.component';

describe('AppComponent Component', () => {
  let fixture;
  let component;
  let platformMock;
  let splashScreenMock;
  let statusBarMock;

  beforeEach(async(() => {

    platformMock = createPlatformMock();

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
  });

  it('should be initialized', () => {
    expect(component instanceof AppComponent).to.equal(true);
    expect(splashScreenMock.hide.calledTwice).to.equal(true);
    expect(statusBarMock.styleDefault.called).to.equal(true);
  });

  it('should have two pages', () => {
    expect(component.pages.length).to.equal(2);
  });

});
