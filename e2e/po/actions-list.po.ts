import { by, ElementArrayFinder, ElementFinder } from 'protractor';

import { expectDisplayed, presenceOf } from '../utils';
import { AbstractPageObject } from './abstract.po';
import { ActionPageObject } from './action.po';

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
    return this.getActionsList().all(by.css('bip-action-card'));
  }

  /**
   * Returns an element finder for the `<ion-infinite-scroll>` tag that is located at the very end of the actions lit, and should trigger an InfiniteScroll load event when arriving into view.
   */
  getInfiniteScroll(): ElementFinder {
    return this.getPage().element(by.css('ion-infinite-scroll'));
  }

  /**
   * Go to the n-th action's page, wait for the page to load and check that it is displayed.
   * @param n The index of the action to go to.
   * @returns A action page obejct.
   */
  async goToAction(n: number): Promise<ActionPageObject> {
    const actions = await this.getActionListItems();
    actions[n].click();

    const actionPage = new ActionPageObject('action-page');
    const actionPageFinder = actionPage.getPage();
    await presenceOf(actionPageFinder);
    await expectDisplayed(actionPageFinder, 'Action Page is not displayed while it should be.');

    return actionPage;
  }

}
