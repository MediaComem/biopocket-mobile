import { by, element, ElementFinder } from 'protractor';

export class MenuPageObject {

  /**
   * Returns an element finder for the Ionic inner menu.
   */
  getPage(): ElementFinder {
    return element(by.css('div.menu-inner'));
  }

  /**
   * Returns an element finder for a menu item whose `id` matches `<pageRef>-menu-item`.
   * The provided `pageRef` value should be one of the defined `MenuItem`'s `pageRef` in `app.component.ts`.
   * @param pageRef The pageRef of the required menu item.
   */
  getItem(pageRef: string): ElementFinder {
    return this.getPage().element(by.id(`${pageRef}-menu-item`));
  }

  getKeepInTouchButton(): ElementFinder {
    return this.getPage().element(by.id('keep-in-touch'));
  }

  getLoginButton(): ElementFinder {
    return this.getPage().element(by.css('#login'));
  }
}
