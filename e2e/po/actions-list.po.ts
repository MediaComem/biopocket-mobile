import { by, ElementArrayFinder, ElementFinder } from 'protractor';
import { AbstractPageObject } from './abstract.po';

/**
 * Page object representing the actions list screen.
 */
export class ActionsListPageObject extends AbstractPageObject {

  expectedTitle: string;

  constructor(selector: string) {
    super(selector);
    this.expectedTitle = 'Liste des actions';
  }

  /**
   * Returns an element finder for the Ionic `<ion-list>` tag in the ActionsList page, which contains the list of the displayed actions.
   */
  getActionsList(): ElementFinder {
    return this.getPage().element(by.css('ion-list'));
  }

  /**
   * Returns an array of ElementFinder for all `<ion-item>` tag inside the `getActionsList` result.
   * Each of these item should display information about a particular action.
   */
  getActionListItems(): ElementArrayFinder {
    return this.getActionsList().all(by.css('ion-item'));
  }

  /**
   * Returns an element finder for the `<ion-infinite-scroll>` tag that is located at the very end of the actions lit, and should trigger an InfiniteScroll load event when arriving into view.
   */
  getInfiniteScroll(): ElementFinder {
    return this.getPage().element(by.css('ion-infinite-scroll'));
  }

}
