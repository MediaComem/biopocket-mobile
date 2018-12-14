import { distance, point } from '@turf/turf';
import { browser, ExpectedConditions as EC } from 'protractor';

// DO NOT MOVE these lines.
// Environment variables MUST be set BEFORE backend files are imported.
import { setUp } from './setup';
setUp();

import * as actionFixtures from '../backend/server/spec/fixtures/actions';
import * as locationFixtures from '../backend/server/spec/fixtures/location';
import { create as createData } from '../backend/utils/data';
import { expect } from '../spec/chai';
import { ActionPageObject } from './po/action.po';
import { ActionsListPageObject } from './po/actions-list.po';
import { MapPageObject } from './po/map.po';
import { ThemePageObject } from './po/theme.po';
import { absenceOf, AVERAGE_WAIT_TIME, compareCoordinates, expectDisplayed, invisibilityOf, presenceOf, visibilityOf } from './utils';

const ONEX_BBOX = {
  southWest: [ 6.086417, 46.173987 ],
  northEast: [ 6.112753, 46.196898 ],
  padding: []
};

// Add a 10% padding to latitude & longitude (to make sure markers are displayed well within the screen area).
ONEX_BBOX.padding.push((ONEX_BBOX.northEast[1] - ONEX_BBOX.southWest[1]) / 10);
ONEX_BBOX.padding.push((ONEX_BBOX.northEast[0] - ONEX_BBOX.southWest[0]) / 10);

// Compute bounding box width & height in kilometers.
const ONEX_BBOX_WIDTH = distance(point(ONEX_BBOX.southWest), point([ ONEX_BBOX.northEast[0], ONEX_BBOX.southWest[1] ]));
const ONEX_BBOX_HEIGHT = distance(point(ONEX_BBOX.southWest), point([ ONEX_BBOX.southWest[0], ONEX_BBOX.northEast[1] ]));

describe('App', function() {

  let locations, actions;
  let mapPage: MapPageObject;
  let actionsListPage: ActionsListPageObject;
  let actionPage: ActionPageObject;
  let themePage: ThemePageObject;

  beforeEach(async function() {
    mapPage = new MapPageObject('map-page');
    actionsListPage = new ActionsListPageObject('actions-list-page');
    // actionPage = new ActionPageObject('action-page');

    // Insert 3 random locations into the database and sort them by ascending longitude and latitude.
    locations = await createData(3, locationFixtures.location, { bbox: ONEX_BBOX });
    locations.sort((a, b) => compareCoordinates(a.get('geometry'), b.get('geometry')));

    // Insert 3 random actions into the database.
    actions = await createData(6, actionFixtures.action, {});
    actions.sort((a, b) => a.get('title').toLowerCase().localeCompare(b.get('title').toLowerCase()));

    // Set a window size with the same width/height ratio as the Onex bounding box.
    const windowWidth = 1440;
    const windowHeight = windowWidth / (ONEX_BBOX_WIDTH / ONEX_BBOX_HEIGHT);
    await mapPage.setWindowSize(windowWidth, windowHeight);
  });

  /**
   * --- Main e2e scenario ---
   *
   * This end-to-end scenario simulates a user going through the following steps :
   * 1. Arriving on the root page, which should be the Map Page.
   * 2. Clicking on a Location map marker, and thus displaying the popover with the correct information.
   * 3. Dismissing the popover by clicking on its backdrop.
   * 4. Navigating to the Actions List page by clicking on the adequate button on the Map page.
   * 5. Scrolling to the bottom of the actions list page and trigger a new load.
   * 6. Clicking on the first action on the actions list page, and thus displaying the correct Action page.
   * 7. Clicking on the theme on the action page, and thus displaying the correct Theme page.
   * 8. Clicking on the back button and thus returning to the previous Action page.
   */
  it('should allow a user to execute the main scenario', async function() {
    this.timeout(20000);

    /**
     * 1. Arriving on the root page, which should be the Map Page.
     */

    // Navigate to the map page.
    await mapPage.navigateTo();
    await expect(mapPage.getTitle()).to.eventually.equal('BioPocket');

    // Wait for the map page to show up on the DOM
    const mapPageFinder = mapPage.getPage();
    await presenceOf(mapPageFinder);
    await expectDisplayed(mapPageFinder, { elementName: 'Map Page' });
    await expect(mapPage.getPageTitle().getText()).to.eventually.equal('Carte');

    // Ensure that all markers are displayed.
    const markerIconFinders = await mapPage.getMarkerIcons();
    expect(markerIconFinders).to.have.lengthOf(3);

    /**
     * Clicking on a Location map marker, and thus displaying the popover with the correct information.
     */

    // Click on the first marker (they are also sorted by ascending longitude and latitude).
    markerIconFinders[0].click();

    // Ensure that the popover is displayed.
    const popoverFinder = mapPage.getPopover();
    await visibilityOf(popoverFinder);
    await expectDisplayed(popoverFinder, { elementName: 'Popover' });

    // Ensure that the data of the correct location is displayed in the popover.
    // Since both the location fixtures and marker icons have been sorted by ascending longitude and
    // latitude, the first location should correspond to the first marker icon.
    const location = locations[0];
    const locationDetailsText = await mapPage.getLocationDetails().getText();
    expect(locationDetailsText).to.have.string(location.get('name'));
    expect(locationDetailsText).to.have.string(location.get('short_name'));

    /**
     * 3. Dismissing the popover by clicking on its backdrop.
     */

    // To dismiss the popover, get its backdrop element.
    const popoverBackdropFinder = await mapPage.getPopoverBackdrop();
    await expect(popoverBackdropFinder.isPresent(), 'Popover backdrop is not present while it should be.').to.eventually.equal(true);

    popoverBackdropFinder.click();

    // Wait for the popover element to be detached from the DOM.
    await absenceOf(popoverFinder);
    await expect(popoverFinder.isPresent(), 'Popover is present while it shouldn\'t be.').to.eventually.equal(false);

    /**
     * 4. Navigating to the Actions List page by clicking on the adequate button on the Map page.
     */

    // Get the "go to actions list" button
    const goToListActionFinder = await mapPage.getGoToActionsListButton();
    await expect(goToListActionFinder.isPresent()).to.eventually.equal(true);

    // Resize the window size small enough to force a scroll in the Actions List Page
    await actionsListPage.setWindowSize(600, 400);

    goToListActionFinder.click();

    // Wait for the actions list page to show up on the DOM
    const actionsListPageFinder = actionsListPage.getPage();
    await presenceOf(actionsListPageFinder);
    await expectDisplayed(actionsListPageFinder, { elementName: 'ActionsList Page' });

    // Ensure that the navbar title is indeed the expected title.
    const actionsListPageTitleFinder = await actionsListPage.getPageTitle();
    await expect(actionsListPageTitleFinder.getText()).to.eventually.have.string(actionsListPage.expectedTitle);

    // Ensure that there are as many actions on the page as there are in the database
    let actionListItemsFinder = await actionsListPage.getActionListItems();
    expect(actionListItemsFinder).to.have.lengthOf(5);

    /**
     * 5. Scrolling to the bottom of the actions list page and trigger a new load.
     */

    // Scroll to page bottom to trigger an infinite scroll load
    await actionsListPage.scrollTo(actionsListPage.getInfiniteScroll());

    // Wait for the data to load
    // TODO: see if this can be replaced by a browser.wait call with a custom
    //       function that returns true when there are 6 items in the list
    await browser.sleep(1000);

    // Ensure that more actions have been loaded on the page.
    actionListItemsFinder = await actionsListPage.getActionListItems();
    expect(actionListItemsFinder).to.have.lengthOf(6);

    // Go to the first action page
    actionPage = await actionsListPage.goToAction(0);

    // Ensure that the navbar title is indeed the expected title.
    const actionPageTitleFinder = await actionPage.getPageTitle();
    await expect(actionPageTitleFinder.getText()).to.eventually.have.string(actionPage.expectedTitle);

    // Ensure that the content of the page matches the action data
    const actionDetailsText = await actionPage.getActionDetails().getText();
    expect(actionDetailsText).to.have.string(actions[0].get('title'));
    expect(actionDetailsText).to.have.string(actions[ 0 ].get('description'));

    /**
     * 7. Clicking on the theme on the action page, and thus displaying the correct Theme page.
     */

    // Click on the theme
    const actionPageThemeTitleFinder = await actionPage.getThemeTitle();
    await expect(actionPageThemeTitleFinder.isPresent()).to.eventually.equal(true);
    await browser.wait(EC.elementToBeClickable(actionPageThemeTitleFinder), 5000);

    // Click on the theme title
    actionPageThemeTitleFinder.click();
    // OK... for an unknown reason, without this 1ms of sleep, the click does not perform the transition to the Theme page...
    // It justs stalls on the Action page without doing nothing.
    await browser.sleep(1);

    // Wait for the Theme page to show up ono the DOM
    const themePageFinder = await themePage.getPage();
    await presenceOf(themePageFinder);
    await expectDisplayed(themePageFinder, { elementName: 'Theme Page' });
    await invisibilityOf(actionPageFinder);
    await expectDisplayed(actionPageFinder, { elementName: 'Action Page', shouldBeDisplayed: false });

    // expect(true, "Don't forget to check that the content of the Theme Page is as expected.").to.equal(false);

    // Ensure that the navbar title is indeed the expected title.
    const themePageTitleFinder = await themePage.getPageTitle();
    await expect(themePageTitleFinder.getText()).to.eventually.have.string(themePage.expectedTitle);

    // Ensure that the content of the page matches the theme data.
    const themeDetailsText = await themePage.getThemeDetailsText();
    // @Simon: I don't understand...
    // Withtout a call to `load` before, the call to `related` fetchs a Theme all right, but it'is NOT the theme to which the action is actually related.
    // Why do I need to call `load` THEN `related` to access to correct theme? Isn't `related` supposed to load the related theme, as its name would imply?
    // Plus, calling `load` before `related` would log a request done on the db to `SELECT` the theme from the table.
    // This log is not there when `load` is not called. Does this mean that `related` does not execute any query?
    // If so, how the hell does it load a theme at all?
    await actions[0].load('theme');
    const theme = await actions[0].related('theme');
    // This is to detect the above mentioned strange behavior.
    expect(actions[0].get('theme_id')).to.equal(theme.get('id'));
    expect(themeDetailsText).to.have.string(theme.get('title'));
    expect(themeDetailsText).to.have.string(theme.get('description'));

    /**
     * 8. Clicking on the back button and thus returning to the previous Action page.
     */

    // Click on the back button from the Theme Page
    const themePageBackButton = await themePage.getBackButton();
    await browser.wait(EC.elementToBeClickable(themePageBackButton), AVERAGE_WAIT_TIME);
    themePageBackButton.click();

    // Ensure that the Action Page shows up in lieu of the Theme Page.
    await absenceOf(themePageFinder);
    await expectDisplayed(actionPageFinder, { elementName: 'Action Page' });
  });
});
