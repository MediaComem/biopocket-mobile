import { async, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { expect } from 'chai';
import { createStubInstance } from 'sinon';

import { HomePage } from './home';

describe('HomePage Component', () => {
  let fixture;
  let component;
  let navControllerMock;

  beforeEach(async(() => {

    navControllerMock = {};

    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [
        IonicModule.forRoot(HomePage)
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
