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

  async setWindowSize(width: number, height: number): Promise<void> {
    await browser.driver.manage().window().setSize(width, height);
  }
}
