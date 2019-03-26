import { by, element, ElementFinder } from 'protractor';

import { AbstractPageObject } from './abstract.po';

export class ActionPageObject extends AbstractPageObject {

  expectedTitle: string;

  constructor(selector: string) {
    super(selector);
    this.expectedTitle = 'Action';
  }

  getActionDetails(): ElementFinder {
    return element(by.css('header'));
  }
}