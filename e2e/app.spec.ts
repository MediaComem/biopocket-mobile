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
import { ActionsListPageObject } from './po/actions-list.po';
import { MapPageObject } from './po/map.po';
import { compareCoordinates, expectDisplayed, presenceOf } from './utils';

const ONEX_BBOX = {
  southWest: [ 6.086417, 46.173987 ],
  northEast: [ 6.112753, 46.196898 ],
  padding: []
};

// Timeout value for DOM fetching operation.
// No transition or animation on DOM element should take more than 5 secondes to finish.
const AVERAGE_WAIT_TIME = 5000;

// Add a 10% padding to latitude & longitude (to make sure markers are displayed well within the screen area).
ONEX_BBOX.padding.push((ONEX_BBOX.northEast[1] - ONEX_BBOX.southWest[1]) / 10);
ONEX_BBOX.padding.push((ONEX_BBOX.northEast[0] - ONEX_BBOX.southWest[0]) / 10);

// Compute bounding box width & height in kilometers.
const ONEX_BBOX_WIDTH = distance(point(ONEX_BBOX.southWest), point([ ONEX_BBOX.northEast[0], ONEX_BBOX.southWest[1] ]));
const ONEX_BBOX_HEIGHT = distance(point(ONEX_BBOX.southWest), point([ ONEX_BBOX.southWest[0], ONEX_BBOX.northEast[1] ]));

describe('App', function() {

  let locations;
  let mapPage: MapPageObject;
  let actionsListPage: ActionsListPageObject;

  beforeEach(async function() {
    mapPage = new MapPageObject('map-page');
    actionsListPage = new ActionsListPageObject('actions-list-page');

    // Insert 3 random locations into the database and sort them by ascending longitude and latitude.
    locations = await createData(3, locationFixtures.location, { bbox: ONEX_BBOX });
    locations.sort((a, b) => compareCoordinates(a.get('geometry'), b.get('geometry')));

    // Insert 3 random actions into the database.
    await createData(6, actionFixtures.action, {});

    // Set a window size with the same width/height ratio as the Onex bounding box.
    const windowWidth = 1440;
    const windowHeight = windowWidth / (ONEX_BBOX_WIDTH / ONEX_BBOX_HEIGHT);
    await mapPage.setWindowSize(windowWidth, windowHeight);
  });

  /**
   * --- Main e2e scenario ---
   *
   * This end-to-end scenario simulates a user going through the following steps:
   * 1. Launching the BioPocket app
   * 2. Arriving on the root page, which should be the Map Page
   * 3. Clicking on a Location map marker, and thus displaying the popover with the correct information
   * 4. Dismissing the popover by clicking on its backdrop
   * 5. Navigating to the Actions List page by clicking on the adequate button on the Map page
   * 6. Scrolling to the bottom of the actions list page and triggering a new load
   */
  it('should allow a user to execute the main scenario', async function() {
    this.timeout(15000);

    // Navigate to the map page.
    await mapPage.navigateTo();
    await expect(mapPage.getTitle()).to.eventually.equal('BioPocket');

    // Wait for the actions list page to show up on the DOM
    const mapPageFinder = mapPage.getPage();
    await presenceOf(mapPageFinder);
    await expectDisplayed(mapPageFinder, 'MapPage is not displayed while it should be.');
    await expect(mapPage.getPageTitle().getText()).to.eventually.equal('Carte');

    // Ensure that all markers are displayed.
    const markerIconFinders = await mapPage.getMarkerIcons();
    expect(markerIconFinders).to.have.lengthOf(3);

    // Click on the first marker (they are also sorted by ascending longitude and latitude).
    markerIconFinders[0].click();

    // Ensure that the popover is displayed.
    const popoverFinder = mapPage.getPopover();
    await presenceOf(popoverFinder);
    await expectDisplayed(popoverFinder, 'Popover is not displayed while it should be');

    // Ensure that the data of the correct location is displayed in the popover.
    // Since both the location fixtures and marker icons have been sorted by ascending longitude and
    // latitude, the first location should correspond to the first marker icon.
    const location = locations[0];
    const locationDetailsText = await mapPage.getLocationDetails().getText();
    expect(locationDetailsText).to.have.string(location.get('name'));
    expect(locationDetailsText).to.have.string(location.get('short_name'));

    // To dismiss the popover, get its backdrop element.
    const popoverBackdropFinder = await mapPage.getPopoverBackdrop();
    await expect(popoverBackdropFinder.isPresent(), 'Popover backdrop is not present while it should be.').to.eventually.equal(true);

    popoverBackdropFinder.click();

    // Wait for the popover element to be detached from the DOM.
    await browser.wait(EC.stalenessOf(popoverFinder), AVERAGE_WAIT_TIME);
    await expect(popoverFinder.isPresent(), 'Popover is present while it shouldn\'t be.').to.eventually.equal(false);

    // Get the "go to actions list" button
    const goToListActionFinder = await mapPage.getGoToActionsListButton();
    await expect(goToListActionFinder.isPresent()).to.eventually.equal(true);

    // Resize the window size small enough to force a scroll in the Actions List Page
    await actionsListPage.setWindowSize(600, 400);

    goToListActionFinder.click();

    // Wait for the actions list page to show up on the DOM
    const actionsListPageFinder = actionsListPage.getPage();
    await presenceOf(actionsListPageFinder);
    await expectDisplayed(actionsListPageFinder, 'ActionsList Page is not displayed while it should be.');

    // Ensure that the navbar title is indeed the expected title.
    const actionsListPageTitleFinder = await actionsListPage.getPageTitle();
    await expect(actionsListPageTitleFinder.getText()).to.eventually.have.string(actionsListPage.expectedTitle);

    // Ensure that there are as many actions on the page as there are in the database
    let actionListItemsFinder = await actionsListPage.getActionListItems();
    expect(actionListItemsFinder).to.have.lengthOf(5);

    // Scroll to page bottom to trigger an infinite scroll load
    await actionsListPage.scrollTo(actionsListPage.getInfiniteScroll());

    // Wait for the data to load
    await browser.sleep(1000);

    // Ensure that more actions have been loaded on the page.
    actionListItemsFinder = await actionsListPage.getActionListItems();
    expect(actionListItemsFinder).to.have.lengthOf(6);
  });
});
