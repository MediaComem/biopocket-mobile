import { AbstractControl } from '@angular/forms';
import { stub } from 'sinon';

import { expect } from '@spec/chai';
import { observableOf } from '@utils/observable';

import { RegistrationService } from '../../providers/registration/registration';
import { EmailExistenceValidator } from './email-existence';

export function emailExistenceValidatorTests() {
  describe('EmailExistenceValidator', () => {

    let validator: EmailExistenceValidator;
    let registrationServiceMock;
    let controlFake;

    beforeEach(() => {
      registrationServiceMock = {
        checkEmailExistence: stub()
      };

      controlFake = {
        value: 'john.doe@example.com'
      };

      validator = new EmailExistenceValidator(registrationServiceMock as RegistrationService);
    });

    it('should compile', function() {
      expect(validator).to.be.an.instanceOf(EmailExistenceValidator);
    });

    describe('if the email is expected to exist', () => {

      beforeEach(() => {
        registrationServiceMock.checkEmailExistence.reset();
        validator.shouldExist = true;
      });

      it('should pass the validation when the email does exist', function() {
        registrationServiceMock.checkEmailExistence.returns(observableOf(true));

        validator.validate(controlFake as AbstractControl).subscribe(result => {
          expect(registrationServiceMock.checkEmailExistence).to.have.callCount(1);
          expect(registrationServiceMock.checkEmailExistence).to.have.been.calledWith('john.doe@example.com');
          expect(result).to.eql(null);
        });
      });

      it('should fail the validation when the email does not exist', function() {
        registrationServiceMock.checkEmailExistence.returns(observableOf(false));

        validator.validate(controlFake as AbstractControl).subscribe(result => {
          expect(registrationServiceMock.checkEmailExistence).to.have.callCount(1);
          expect(registrationServiceMock.checkEmailExistence).to.have.been.calledWith('john.doe@example.com');
          expect(result).to.eql({ existence: true });
        });
      });

    });

    describe('if the email is expected to be missing', () => {

      beforeEach(() => {
        registrationServiceMock.checkEmailExistence.reset();
        validator.shouldExist = false;
      });

      it('should pass the validation when the email does not exist', function() {
        registrationServiceMock.checkEmailExistence.returns(observableOf(false));

        validator.validate(controlFake as AbstractControl).subscribe(result => {
          expect(registrationServiceMock.checkEmailExistence).to.have.callCount(1);
          expect(registrationServiceMock.checkEmailExistence).to.have.been.calledWith('john.doe@example.com');
          expect(result).to.eql(null);
        });
      });

      it('should fail the validation when the email exist', function() {
        registrationServiceMock.checkEmailExistence.returns(observableOf(true));

        validator.validate(controlFake as AbstractControl).subscribe(result => {
          expect(registrationServiceMock.checkEmailExistence).to.have.callCount(1);
          expect(registrationServiceMock.checkEmailExistence).to.have.been.calledWith('john.doe@example.com');
          expect(result).to.eql({ existence: true });
        });
      });

    });

  });
}