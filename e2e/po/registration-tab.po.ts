import { by, ElementFinder } from 'protractor';

import { AbstractPageObject } from './abstract.po';

export class RegistrationTabsPageObject extends AbstractPageObject {

  constructor() {
    super('registration-tabs-page', 'Garder contact');
  }

  /**
   * Returns an element finder for the currently active tab.
   */
  getActiveTab(): ElementFinder {
    return this.getPage().element(by.css('a.tab-button[aria-selected="true"]'));
  }

  /**
   * Returns an element finder for the second tab of the page.
   */
  async getSecondTab(): Promise<ElementFinder> {
    return (await this.getPage().all(by.className('tab-button')))[1];
  }
}