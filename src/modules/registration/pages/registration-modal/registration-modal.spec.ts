import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavParams, ViewController } from 'ionic-angular';
import { mockView } from 'ionic-angular/util/mock-providers';

import { BipIconStub } from '@components/bip-icon/bip-icon.stub';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

import { RegistrationFormStubComponent } from '../../components/registration-form/registration-form.stub';
import { RegistrationModal } from './registration-modal';

export function registrationModalTests() {
  describe('RegistrationModal', () => {

    let fixture: ComponentFixture<RegistrationModal>;
    let component: RegistrationModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          RegistrationModal,
          BipIconStub,
          RegistrationFormStubComponent
        ],
        imports: [
          IonicModule.forRoot(RegistrationModal),
          translateModuleForRoot
        ],
        providers: [
          { provide: ViewController, useValue: mockView() },
          { provide: NavParams, useValue: {} }
        ]
      });

      fixture = TestBed.createComponent(RegistrationModal);
      component = fixture.componentInstance;
    });

    it('should be created', function() {
      expect(component).to.be.an.instanceOf(RegistrationModal);
    });

  });
}