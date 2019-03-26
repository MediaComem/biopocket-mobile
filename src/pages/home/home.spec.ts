// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { expect } from 'chai';
import { IonicModule, NavController } from 'ionic-angular';

import { HomePage } from '@pages/home/home';
import { translateModuleForRoot } from '@utils/i18n';

describe('HomePage', () => {
  let fixture;
  let component;
  let navControllerMock;

  beforeEach(() => {

    navControllerMock = {};

    TestBed.configureTestingModule({
      declarations: [
        HomePage
      ],
      imports: [
        IonicModule.forRoot(HomePage),
        MomentModule,
        translateModuleForRoot
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).to.be.an.instanceOf(HomePage);
  });
});
