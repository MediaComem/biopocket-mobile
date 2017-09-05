import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { expect } from 'chai';

import { BioPocket } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from '../../spec/mocks-ionic';

describe('BioPocket Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BioPocket],
      imports: [
        IonicModule.forRoot(BioPocket)
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioPocket);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof BioPocket).to.equal(true);
  });

  it('should have two pages', () => {
    expect(component.pages.length).to.equal(2);
  });

});
