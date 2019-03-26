import { by, ElementArrayFinder } from 'protractor';
import { AbstractPageObject } from './abstract.po';

export class ThemePageObject extends AbstractPageObject {
  expectedTitle: string;

  constructor(selector: string) {
    super(selector);
    this.expectedTitle = 'Thème';
  }

  getThemeDetails(): ElementArrayFinder {
    return this.getPage().all(by.tagName('section'));
  }

  async getThemeDetailsText(): Promise<string> {
    return (await this.getThemeDetails().map(element => element.getText())).join();
  }
}