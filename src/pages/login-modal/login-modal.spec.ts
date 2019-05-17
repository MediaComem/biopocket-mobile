import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ViewController } from 'ionic-angular';
import { mockView } from 'ionic-angular/util/mock-providers';
import { stub } from 'sinon';

import { BipIconStub } from '@components/bip-icon/bip-icon.stub';
import { BipInputStateIndicatorStub } from '@components/bip-input-state-indicator/bip-input-state-indicator.stub';
import { AuthService } from '@providers/auth-service/auth-service';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';
import { observableOf, observableThatThrows } from '@utils/observable';
import { LoginModal } from './login-modal';

describe.only('LoginModal', () => {

  let fixture: ComponentFixture<LoginModal>;
  let component: LoginModal;
  let mockAuthService;

  beforeEach(() => {

    mockAuthService = {
      logIn: stub()
    };

    TestBed.configureTestingModule({
      declarations: [
        LoginModal,
        BipInputStateIndicatorStub,
        BipIconStub
      ],
      imports: [
        IonicModule.forRoot(LoginModal),
        translateModuleForRoot
      ],
      providers: [
        { provide: ViewController, useValue: mockView() },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    fixture = TestBed.createComponent(LoginModal);
    component = fixture.componentInstance;

  });

  it('should be created with the default values', function () {
    expect(component).to.be.an.instanceOf(LoginModal);
    expect(component.credentials.email).to.equal('');
    expect(component.credentials.password).to.equal('');
  });

  describe('#onSubmit()', () => {

    it('should check the credentials', function () {
      component.credentials = {
        email: 'test@foo.bar',
        password: 'test'
      };
      mockAuthService.logIn.returns(observableOf({}));
      component.onSubmit();
      expect(mockAuthService.logIn).to.have.been.calledWith(component.credentials);
      expect(mockAuthService.logIn).to.have.callCount(1);
    });

    it('should try to connect a user', function () {
      mockAuthService.logIn.returns(observableOf({}));
      component.onSubmit();
      expect(component.user).to.eql({});
    });

    it('should display an error message if the login fails', function () {
      const authFailure = {
        error:  {
          errors: [
          {
            code: 'auth.invalidUser',
            message: 'This user account does not exist or is inactive.'
          }
        ]
      }};
      mockAuthService.logIn.returns(observableThatThrows(authFailure));
      component.onSubmit();
      expect(component.authFail).to.eql(authFailure.error);
    });
  });

  describe('#onSubmit()-form-errors-message', () => {

    it('should display invalid email error message');

    it('should display required email error message');

    it('should display required password error message');
  });
});
