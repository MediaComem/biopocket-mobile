// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { async, TestBed } from '@angular/core/testing';
import { MomentModule } from 'angular2-moment';
import { IonicModule, NavController } from 'ionic-angular';
import { expect } from 'chai';

import { translateModuleForRoot } from '../../utils/i18n';
import { HomePage } from './home';

describe('HomePage', () => {
  let fixture;
  let component;
  let navControllerMock;

  beforeEach(async(() => {

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
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof HomePage).to.equal(true);
  });
});
