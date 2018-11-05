import { browser, by, element, ElementFinder } from 'protractor';

import { compareCoordinates } from '../utils';
import { AbstractPageObject } from './abstract.po';

/**
 * Page object representing the main map screen.
 */
export class MapPageObject extends AbstractPageObject {

  constructor(selector: string) {
    super(selector);
  }

  /**
   * Navigates to the map page.
   */
  navigateTo() {
    return browser.get('/');
  }

  /**
   * Returns a promise that will be resolved with an array containing an element finder for
   * each marker displayed on the map.
   *
   * The array of markers will be sorted by ascending longitude and latitude (in that order).
   */
  async getMarkerIcons(): Promise<ElementFinder[]> {

    const markerIconFinders: ElementFinder[] = await element.all(by.css('.leaflet-marker-icon'));

    const markerIconsWithCoordinates = await Promise.all(markerIconFinders.map(async (markerIcon, i) => {
      const location = await markerIcon.getLocation();
      return {
        index: i,
        // Note: negate the y coordinate for consistency with the latitude comparison
        // (a higher y coordinate on the screen is closer to the bottom of the map while a higher latitude is closer to the top).
        coordinates: [ location.x, -location.y ]
      };
    }));

    markerIconsWithCoordinates.sort(compareCoordinates);

    return markerIconsWithCoordinates.map(data => markerIconFinders[data.index]);
  }

  /**
   * Returns an element finder for the Ionic popover displayed when the user clicks on a map marker.
   */
  getPopover(): ElementFinder {
    return element(by.css('ion-popover.location-details'));
  }

  /**
   * Returns an element finder for the Ionic popover backdrop displayed when a popover is present in the page.
   */
  getPopoverBackdrop(): ElementFinder {
    return this.getPopover().element(by.css('ion-backdrop'));
  }

  /**
   * Returns an element finder for the button on the Map Page that should make the user navigate to the list of actions.
   */
  getGoToActionsListButton(): ElementFinder {
    return element(by.css('button#go-to-list'));
  }

  /**
   * Returns an element finder for the `<ion-list>` tag in the popover which displays the location
   * details. Note that this element is not displayed until the location has been loaded with an
   * HTTP call.
   */
  getLocationDetails(): ElementFinder {
    return this.getPopover().element(by.css('ion-list'));
  }
}
