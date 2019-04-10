import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { MenuItemIcon } from '@models/menu-item-icon';

/**
 * This class decorates a Component with a `title` property that returns the properly translated page title.
 * It should be used when adding new items on the `AppComponent.pages` arrray.
 */
export class MenuItem {

  /**
   * @constructor
   * @param {String} pageRef A string that is referenced in the `src/locales/fr.yml` file as being a page name
   * @param {any} component The page component to decorate
   * @param {TranslateService} translateService A translate service used by the `title` property
   */
  constructor(
    readonly pageRef: string,
    readonly component: any,
    readonly icon: MenuItemIcon,
    private readonly translateService: TranslateService) {
  }

  /**
   * Returns the page title translated in the current locale, based on the `pageName` property of this `MenuItem`
   */
  get title(): Observable<string> {
    return this.translateService.get(`pages.${this.pageRef}.title`);
  }

}
