import { browser } from 'protractor';

/**
 * Abstract page object with common functionality.
 */
export class AbstractPageObject {

  /**
   * Returns a promise that will be resolved with the title of the page.
   */
  async getTitle(): Promise<string> {
    return browser.getTitle();
  }
}
