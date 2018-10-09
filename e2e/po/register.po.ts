import { by, ElementArrayFinder, ElementFinder } from 'protractor';

import { AbstractPageObject } from './abstract.po';

export class RegisterPageObject extends AbstractPageObject {

  constructor() {
    super('register-page', "S'inscrire");
  }

  /**
   * Returns an element finder for the email input in the registration form.
   */
  getEmailInput(): ElementFinder {
    return this.getPage().element(by.id('registration-email'));
  }

  /**
   * Returns an element finder for the first name input in the registration form.
   */
  getFirstNameInput(): ElementFinder {
    return this.getPage().element(by.id('registration-firstname'));
  }

  /**
   * Returns an element finder for the last name input in the registration form.
   */
  getLastNameInput(): ElementFinder {
    return this.getPage().element(by.id('registration-lastname'));
  }

  /**
   * Returns an element finder for the submit button in the registration form.
   */
  getFormSubmitButton(): ElementFinder {
    return this.getPage().element(by.css('button[type="submit"]'));
  }

  /**
   * Returns an element finder for the registration form.
   */
  getForm(): ElementFinder {
    return this.getPage().element(by.id('registration-form'));
  }

  /**
   * Returns an element finder for the div containing information on the saved registration.
   */
  getRegistrationSuccess(): ElementFinder {
    return this.getPage().element(by.className('registered'));
  }

  /**
   * Returns the value of the registered email once the registration has been submitted.
   */
  async getRegisteredEmail(): Promise<string> {
    return (await this.getRegisteredValuesFinder())[1].getText();
  }

  /**
   * Returns the value of the registered first name once the registration has been submitted.
   */
  async getRegisteredFirstName(): Promise<string> {
    return (await this.getRegisteredValuesFinder())[2].getText();
  }

  /**
   * Returns the value of the registered last name once the registration has been submitted.
   */
  async getRegisteredLastName(): Promise<string> {
    return (await this.getRegisteredValuesFinder())[3].getText();
  }

  /**
   * Get all the `p` that contains returned value from the backend after successfully submitting a registration.
   */
  private getRegisteredValuesFinder(): ElementArrayFinder {
    return this.getPage().all(by.css('.registration-data p:last-of-type'));
  }
}