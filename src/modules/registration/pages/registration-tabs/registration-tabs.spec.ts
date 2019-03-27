import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { mockNavController } from 'ionic-angular/util/mock-providers';

import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

import { RegistrationTabsPage } from './registration-tabs';

export function registrationTabsPageTests() {
  describe('RegistrationTabsPage', () => {

    let fixture: ComponentFixture<RegistrationTabsPage>;
    let component: RegistrationTabsPage;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          RegistrationTabsPage
        ],
        imports: [
          IonicModule.forRoot(RegistrationTabsPage),
          translateModuleForRoot
        ],
        providers: [
          { provide: NavParams, useValue: {} },
          { provide: NavController, useValue: mockNavController() }
        ]
      });

      fixture = TestBed.createComponent(RegistrationTabsPage);
      component = fixture.componentInstance;
    });

    it('should be created', function() {
      expect(component).to.be.an.instanceOf(RegistrationTabsPage);
    });
  });
}