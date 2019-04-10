import { by, ElementFinder } from 'protractor';

import { AbstractPageObject } from './abstract.po';

export class UnregisterPageObject extends AbstractPageObject {

  constructor() {
    super('unregister-page', 'Se désinscrire');
  }

  /**
   * Returns an element finder for the email input element on the page.
   */
  getEmailInput(): ElementFinder {
    return this.getPage().element(by.css('input[type="email"]'));
  }

  /**
   * Returns an element finder for the submit button in the unregistration form.
   */
  getSubmitButton(): ElementFinder {
    return this.getPage().element(by.css('button[type="submit"]'));
  }

  /**
   * Returns an element finder for the unregistration form.
   */
  getForm(): ElementFinder {
    return this.getPage().element(by.id('unregister-form'));
  }

  /**
   * Returns an element finder for the `div` displaying a success message after deleting the registration.
   */
  getSuccessFinder(): ElementFinder {
    return this.getPage().element(by.className('unregistered'));
  }
}