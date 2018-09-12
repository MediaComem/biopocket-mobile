import { by, element, ElementFinder } from 'protractor';

import { AbstractPageObject } from './abstract.po';

export class ActionPageObject extends AbstractPageObject {

  expectedTitle: string;

  constructor(selector: string) {
    super(selector);
    this.expectedTitle = 'Action';
  }

  getActionDetails(): ElementFinder {
    return this.getPage().element(by.tagName('header'));
  }

  getThemeTitle(): ElementFinder {
    return this.getActionDetails().element(by.css('h2.theme-title'));
  }
}