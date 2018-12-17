import { browser, by, element, ElementFinder, ExpectedConditions as EC, promise } from 'protractor';

import { expect } from '../../spec/chai';
import { AVERAGE_WAIT_TIME } from '../utils';

/**
 * Abstract page object with common functionality.
 */
export class AbstractPageObject {

  selector: string;

  constructor(pageSelector: string) {
    this.selector = pageSelector;
  }

  /**
   * Returns a promise that will be resolved with the title of the page.
   */
  async getTitle(): Promise<string> {
    return browser.getTitle();
  }

  /**
   * Returns a promise that will be resolved when the browser windows has been resized according to the provided width and height.
   * @param width The targeted width.
   * @param height The targeted height.
   */
  async setWindowSize(width: number, height: number): Promise<void> {
    await browser.driver.manage().window().setSize(width, height);
  }

  /**
   * Returns an element finder for the Ionic page DOM element.
   */
  getPage(): ElementFinder {
    return element(by.css(this.selector));
  }

  /**
   * Returns an element finder for the Ionic `<ion-title>` tag in the current page.
   */
  getPageTitle(): ElementFinder {
    return this.getPage().element(by.css('ion-title'));
  }

  getBackButton(): ElementFinder {
    return this.getPage().element(by.css('button.back-button'));
  }

  /**
   * Clicks on the "Go Back" button that should be available on the page.
   * An assertion ensure that the test will fail if the back button is not present.
   */
  async goBack() {
    const backButtonFinder = this.getBackButton();
    await expect(backButtonFinder.isPresent()).to.eventually.equal(true);
    await browser.wait(EC.elementToBeClickable(backButtonFinder), AVERAGE_WAIT_TIME);
    await backButtonFinder.click();
  }

  /**
   * Scrolls the browser to the given `finder` in the DOM.
   * This is done in a "smooth" way, so that any scroll-triggered event can be fired.
   * @param finder The element to scroll to.
   */
  scrollTo(finder: ElementFinder): promise.Promise<{}> {
    return browser.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "end"});', finder);
  }
}
