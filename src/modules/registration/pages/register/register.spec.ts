import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { mockNavController } from 'ionic-angular/util/mock-providers';

import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

import { RegistrationFormStubComponent } from '../../components/registration-form/registration-form.stub';
import { RegisterPage } from './register';

export function registerPageTests() {
  describe('RegisterPage', () => {

    let fixture: ComponentFixture<RegisterPage>;
    let component: RegisterPage;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          RegisterPage,
          RegistrationFormStubComponent
        ],
        imports: [
          IonicModule.forRoot(RegisterPage),
          translateModuleForRoot
        ],
        providers: [
          { provide: NavParams, useValue: {} },
          { provide: NavController, useValue: mockNavController() }
        ]
      });

      fixture = TestBed.createComponent(RegisterPage);
      component = fixture.componentInstance;
    });

    it('should be created', function() {
      expect(component).to.be.an.instanceOf(RegisterPage);
    });

  });
}