import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { mockNavController } from 'ionic-angular/util/mock-providers';

import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

import { UnregistrationFormStubComponent } from '../../components/unregistration-form/unregistration-form.stub';
import { UnregisterPage } from './unregister';


export function unregisterPageTests() {
  describe('UnregisterPage', () => {

    let fixture: ComponentFixture<UnregisterPage>;
    let component: UnregisterPage;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [
          UnregisterPage,
          UnregistrationFormStubComponent
        ],
        imports: [
          IonicModule.forRoot(UnregisterPage),
          translateModuleForRoot
        ],
        providers: [
          { provide: NavParams, useValue: {} },
          { provide: NavController, useValue: mockNavController() }
        ]
      });

      fixture = TestBed.createComponent(UnregisterPage);
      component = fixture.componentInstance;
    });

    it('should be created', function() {
      expect(component).to.be.an.instanceOf(UnregisterPage);
    });
  });
}