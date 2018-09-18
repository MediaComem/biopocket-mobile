import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { stub } from 'sinon';

import { StubComponentsModule } from '@components/stub-components.module';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

import { RegistrationService } from '../../providers/registration/registration';
import { InputStateIndicatorStub } from '../input-state-indicator/input-state-indicator.stub';
import { UnregistrationFormComponent } from './unregistration-form';


export function unregistrationFormComponentTests() {
  describe('UnregistrationFormComponent', () => {

    const API_URI = '/registrations';

    let fixture: ComponentFixture<UnregistrationFormComponent>;
    let component: UnregistrationFormComponent;
    let httpTestingCtrl: HttpTestingController;
    let unregistrationFormFake;

    beforeEach(async () => {
      unregistrationFormFake = {
        reset: stub()
      };

      await TestBed.configureTestingModule({
        declarations: [
          UnregistrationFormComponent,
          InputStateIndicatorStub
        ],
        imports: [
          HttpClientTestingModule,
          StubComponentsModule,
          translateModuleForRoot,
          IonicModule.forRoot(UnregistrationFormComponent)
        ],
        providers: [
          RegistrationService
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(UnregistrationFormComponent);
      component = fixture.componentInstance;

      httpTestingCtrl = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
      httpTestingCtrl.verify();
    });

    it('should compile', function() {
      expect(component).to.be.an.instanceOf(UnregistrationFormComponent);
      expect(component.unregistered).to.equal(false);
    });

    describe('#showForm', () => {
      it('should reset the value of the unregistered property', function() {
        component.unregistered = true;
        component.showForm();
        expect(component.unregistered).to.equal(false);
      });
    });

    describe('#onSubmit', () => {

      beforeEach(() => {
        component.userEmail = 'john.doe@example.com';
      });

      it('should set an error if deleting the registration fails', function() {
        const errorBody = {
          errors: [
            {
              code: 'resource.notFound',
              message: 'No resource was found at this verb and URI.'
            }
          ]
        };

        component.onSubmit(unregistrationFormFake as NgForm);

        httpTestingCtrl.expectOne(`${API_URI}/${component.userEmail}`).flush(errorBody, { status: 404, statusText: 'Not Found' });
        expect(component.error).to.eql(errorBody);
        expect(component.unregistered).to.equal(false);
      });

      it("should correctly update the component's state when deleting the registration succeeds", function() {
        component.onSubmit(unregistrationFormFake as NgForm);

        httpTestingCtrl.expectOne(`${API_URI}/${component.userEmail}`).flush(null, { status: 204, statusText: 'No Content' });
        expect(unregistrationFormFake.reset).to.have.callCount(1);
        expect(component.unregistered).to.equal(true);
      });
    });
  });
}