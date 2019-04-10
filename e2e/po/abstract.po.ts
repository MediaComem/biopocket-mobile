import { browser, by, element, ElementFinder, ExpectedConditions as EC, promise } from 'protractor';

import { expect } from '../../spec/chai';
import { AVERAGE_WAIT_TIME } from '../utils';

/**
 * Abstract page object with common functionality.
 */
export class AbstractPageObject {

  selector: string;
  expectedTitle: string;

  constructor(pageSelector: string, expectedTitle?: string) {
    this.selector = pageSelector;
    this.expectedTitle = expectedTitle;
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
  getTitle(): ElementFinder {
    return this.getPage().element(by.css('ion-title'));
  }

  /**
   * Returns an element finder for the Ionic back button element in the current page.
   */
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
   * Returns an element finder for the Ionic menu button element in the current page.
   */
  getMenuButton(): ElementFinder {
    return this.getPage().element(by.css('button.bar-button-menutoggle'));
  }

  /**
   * Scrolls the browser to the given `finder` in the DOM.
   * This is done in a "smooth" way, so that any scroll-triggered event can be fired.
   * @param finder The element to scroll to.
   */
  scrollTo(finder: ElementFinder): promise.Promise<{}> {
    return browser.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "end"});', finder);
  }

  /**
   * Ensures that the actual title of the page is the one that is expected.
   */
  expectTitle(): Chai.PromisedAssertion {
    return expect(this.getTitle().getText()).to.eventually.equal(this.expectedTitle);
  }
}
