import { browser, by, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { expect } from '../../spec/chai';
import { AbstractPageObject } from './abstract.po';
import { ThemePageObject } from './theme.po';

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

  /**
   * Clicks on an action theme title to trigger navigating to this theme's page.
   */
  async goToTheme(): Promise<ThemePageObject> {

    const actionPageThemeTitleFinder = await this.getThemeTitle();
    await expect(actionPageThemeTitleFinder.isPresent()).to.eventually.equal(true);
    await browser.wait(EC.elementToBeClickable(actionPageThemeTitleFinder), 5000);

    // Click on the theme title
    await actionPageThemeTitleFinder.click();

    return new ThemePageObject('theme-page');
  }
}