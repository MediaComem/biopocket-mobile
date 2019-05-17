import { by, ElementFinder } from 'protractor';

import { AbstractPageObject } from './abstract.po';

export class LoginPageObject extends AbstractPageObject {

  constructor() {
    super('login-modal', 'Se connecter');
  }

  /**
   * Returns an element finder for close button of the login modal.
   */
  getCloseButton(): ElementFinder {
    return this.getPage().element(by.css('#dismiss'));
  }

  /**
   * Returns an element finder for email input of the form.
   */
  getEmailInput(): ElementFinder {
    return this.getPage().element(by.id('login-email'));
  }

  /**
   * Returns an element finder for the login form.
   */
  getForm(): ElementFinder {
    return this.getPage().element(by.id('login-form'));
  }

  /**
   * Returns an element finder for the form submit button.
   */
  getFormSubmitButton(): ElementFinder {
    return this.getPage().element(by.css('button[type="submit"]'));
  }

  /**
   * Returns an element finder for password input of the form.
   */
  getPasswordInput(): ElementFinder {
    return this.getPage().element(by.id('login-password'));
  }

}