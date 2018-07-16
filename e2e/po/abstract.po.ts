import { browser, by, element, ElementFinder, promise } from 'protractor';

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

  /**
   * Scrolls the browser to the given `finder` in the DOM.
   * This is done in a "smooth" way, so that any scroll-triggered event can be fired.
   * @param finder The element to scroll to.
   */
  scrollTo(finder: ElementFinder): promise.Promise<{}> {
    return browser.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "end"});', finder);
  }
}
