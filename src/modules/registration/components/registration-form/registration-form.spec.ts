import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard';
import { Globalization } from '@ionic-native/globalization';
import { Toast } from '@ionic-native/toast';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { stub } from 'sinon';

import { fr } from '@app/locales';
import { StubComponentsModule } from '@components/stub-components.module';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';
import { observableOf } from '@utils/observable';

import { EmailExistenceValidator } from '../../directives/email-existence/email-existence';
import { RegistrationService } from '../../providers/registration/registration';
import { InputStateIndicatorStub } from '../input-state-indicator/input-state-indicator.stub';
import { RegistrationFormComponent } from './registration-form';

export function registrationFormComponentTests() {
  describe('RegistrationFormComponent', () => {

    const API_URI = '/registrations';

    let fixture: ComponentFixture<RegistrationFormComponent>;
    let component: RegistrationFormComponent;
    let registrationFake;
    let formFake, globalizedDate;
    let httpTestingCtrl: HttpTestingController;
    let toastMock, clipboardMock, globalizationMock;

    beforeEach(async () => {

      registrationFake = {
        id: '431bf4df-a67c-488f-86cd-9bf1dff324ff',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@anonymous.com',
        createdAt: '2018-10-12T14:09:08.737Z',
        updatedAt: '2018-10-12T14:09:08.737Z'
      };

      formFake = {
        value: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@anonymous.com'
        },
        reset: stub()
      };

      toastMock = {
        showShortBottom: stub().returns(observableOf(null))
      };
      clipboardMock = {
        copy: stub()
      };
      globalizedDate = '12.10.2018 14:09';
      globalizationMock = {
        dateToString: stub().returns({ value: globalizedDate })
      };

      await TestBed.configureTestingModule({
        declarations: [
          RegistrationFormComponent,
          InputStateIndicatorStub,
          EmailExistenceValidator
        ],
        imports: [
          HttpClientTestingModule,
          StubComponentsModule,
          translateModuleForRoot,
          IonicModule.forRoot(RegistrationFormComponent)
        ],
        providers: [
          RegistrationService,
          { provide: Toast, useValue: toastMock },
          { provide: Clipboard, useValue: clipboardMock },
          { provide: Globalization, useValue: globalizationMock }
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(RegistrationFormComponent);
      component = fixture.componentInstance;

      httpTestingCtrl = TestBed.get(HttpTestingController);

      const translateService = TestBed.get(TranslateService);
      translateService.setTranslation('fr', fr);
      translateService.use('fr');
    });

    afterEach(() => {
      httpTestingCtrl.verify();
    });

    it('should compile', function() {
      expect(component).to.be.an.instanceOf(RegistrationFormComponent);
    });

    describe('#ngOnInit()', () => {
      it("should initialize the component's properties with the correct value", function() {
        component.ngOnInit();
        expect(component.registration).to.eqls({});
        expect(component.submitted).to.equals(false);
      });
    });

    describe('#onSubmit()', () => {
      it('should set an error when saving the registration fails', function() {
        const errorBody = {
          errors: [
            {
              code: 'resource.notFound',
              message: 'No resource was found at this verb and URI.'
            }
          ]
        };
        component.onSubmit(formFake as NgForm);
        httpTestingCtrl.expectOne(API_URI).flush(errorBody, { status: 404, statusText: 'Not Found' });

        expect(component.error).to.eqls(errorBody);
        expect(component.submitted).to.equal(false);
      });
      it("should correctly update the component's state when saving the registration succeeds", function() {
        component.onSubmit(formFake as NgForm);
        httpTestingCtrl.expectOne(API_URI).flush(registrationFake, { status: 201, statusText: 'Created' });

        expect(formFake.reset).to.have.callCount(1);
        expect(component.registration).to.eql(registrationFake);
        expect(component.submitted).to.equal(true);
      });
    });

    describe('#copyRegistrationToClipboard()', () => {
      it('should copy the registration to the clipboard', async function() {
        const expectedCopiedText = `Inscription n°\n\t${registrationFake.id}\nAdresse e-mail\n\t${registrationFake.email}\nPrénom\n\t${registrationFake.firstname}\nNom\n\t${registrationFake.lastname}\nDate d'inscription\n\t${globalizedDate}`;

        component.registration = registrationFake;
        await component.copyRegistrationToClipboard();
        expect(globalizationMock.dateToString.args[0][0]).to.be.a('Date');
        expect(clipboardMock.copy).to.have.callCount(1);
        expect(toastMock.showShortBottom).to.have.callCount(1);
        expect(clipboardMock.copy).to.have.been.calledWith(expectedCopiedText);
        expect(toastMock.showShortBottom).to.have.been.calledWith('Informations copiées dans le presse-papier');
      });
    });
  });
}
