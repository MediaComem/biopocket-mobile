import { inputStateIndicatorComponentTests } from './components/input-state-indicator/input-state-indicator.spec';
import { registrationFormComponentTests } from './components/registration-form/registration-form.spec';
import { unregistrationFormComponentTests } from './components/unregistration-form/unregistration-form.spec';
import { emailExistenceValidatorTests } from './directives/email-existence/email-existence.spec';
import { registerPageTests } from './pages/register/register.spec';
import { registrationModalTests } from './pages/registration-modal/registration-modal.spec';
import { registrationTabsPageTests } from './pages/registration-tabs/registration-tabs.spec';
import { unregisterPageTests } from './pages/unregister/unregister.spec';

describe('RegistrationModule', () => {
  describe('Components', () => {
    inputStateIndicatorComponentTests();
    registrationFormComponentTests();
    unregistrationFormComponentTests();
  });

  describe('Directives', () => {
    emailExistenceValidatorTests();
  });

  describe('Pages', () => {
    registerPageTests();
    registrationModalTests();
    registrationTabsPageTests();
    unregisterPageTests();
  });
});