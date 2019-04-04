import { distance, point } from '@turf/turf';
import { browser, ExpectedConditions as EC, protractor } from 'protractor';

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
import { HomePageObject } from './po/home.po';
import { MapPageObject } from './po/map.po';
import { MenuPageObject } from './po/menu.po';
import { RegisterPageObject } from './po/register.po';
import { RegistrationTabsPageObject } from './po/registration-tab.po';
import { ThemePageObject } from './po/theme.po';
import { UnregisterPageObject } from './po/unregister.po';
import { absenceOf, AVERAGE_WAIT_TIME, compareCoordinates, elementIsClickable, expectDisplayed, invisibilityOf, presenceOf, setWindowSize, visibilityOf } from './utils';

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
  let menuPage: MenuPageObject;
  let homePage: HomePageObject;
  let mapPage: MapPageObject;
  let actionsListPage: ActionsListPageObject;
  let actionPage: ActionPageObject;
  let themePage: ThemePageObject;
  let registrationTabsPage: RegistrationTabsPageObject;
  let registerPage: RegisterPageObject;
  let unregisterPage: UnregisterPageObject;

  beforeEach(async function() {
    mapPage = new MapPageObject();
    menuPage = new MenuPageObject();
    homePage = new HomePageObject();
    mapPage = new MapPageObject();
    actionsListPage = new ActionsListPageObject();
    actionPage = new ActionPageObject();
    themePage = new ThemePageObject();
    registrationTabsPage = new RegistrationTabsPageObject();
    registerPage = new RegisterPageObject();
    unregisterPage = new UnregisterPageObject();

    // Insert 3 random locations into the database and sort them by ascending longitude and latitude.
    locations = await createData(3, locationFixtures.location, { bbox: ONEX_BBOX });
    locations.sort((a, b) => compareCoordinates(a.get('geometry'), b.get('geometry')));

    // Insert 3 random actions into the database.
    actions = await createData(6, actionFixtures.action, {});
    actions.sort((a, b) => a.get('title').toLowerCase().localeCompare(b.get('title').toLowerCase()));

    // Set a window size with the same width/height ratio as the Onex bounding box.
    const windowWidth = 1440;
    const windowHeight = windowWidth / (ONEX_BBOX_WIDTH / ONEX_BBOX_HEIGHT);
    await setWindowSize(windowWidth, windowHeight);
  });

  /**
   * --- Main e2e scenario ---
   *
   * This end-to-end scenario simulates a user going through the following steps :
   * 1. Arriving on the root page, which should be the Home Page.
   * 2. Opening the slide menu.
   * 3. Clicking on the map item and thus arriving on the Map Page.
   * 4. Clicking on a Location map marker, and thus displaying the popover with the correct information.
   * 5. Dismissing the popover by clicking on its backdrop.
   * 6. Navigating to the Actions List page by clicking on the adequate button on the Map page.
   * 7. Scrolling to the bottom of the actions list page and trigger a new load.
   * 8. Clicking on the first action on the actions list page, and thus displaying the correct Action page.
   * 9. Clicking on the theme on the action page, and thus displaying the correct Theme page.
   * 10. Clicking on the back button and thus returning to the previous Action page.
   */
  it('should allow a user to execute the main scenario', async function() {
    this.timeout(30000);

    /**
     * Arriving on the root page, which should be the Home Page.
     */

    await browser.get('/');
    await expect(browser.getTitle()).to.eventually.equal('BioPocket');

    const homePageFinder = homePage.getPage();
    await presenceOf(homePageFinder);
    await expectDisplayed(homePageFinder, { elementName: 'Home Page' });
    await homePage.expectTitle();

    /**
     * Opening the slide menu.
     */

    const menuButtonFinder = homePage.getMenuButton();
    await elementIsClickable(menuButtonFinder);
    menuButtonFinder.click();

    const menuPageFinder = menuPage.getPage();
    await presenceOf(menuPageFinder);
    await expectDisplayed(menuPageFinder, { elementName: 'menu' });

    /**
     * Clicking on the map item and thus arriving on the Map Page.
     */

    // Click on the Map Menu Item
    const mapMenuItemFinder = menuPage.getItem('map');
    await elementIsClickable(mapMenuItemFinder);
    mapMenuItemFinder.click();

    await invisibilityOf(menuPageFinder);

    // Wait for the map page to show up on the DOM
    const mapPageFinder = mapPage.getPage();
    await presenceOf(mapPageFinder);
    await expectDisplayed(mapPageFinder, { elementName: 'Map Page' });
    await mapPage.expectTitle();

    // Ensure that all markers are displayed.
    const markerIconFinders = await mapPage.getMarkerIcons();
    expect(markerIconFinders, 'There is more than 3 markers on the map').to.have.lengthOf(3);

    /**
     * Clicking on a Location map marker, and thus displaying the popover with the correct information.
     */

    // Show the popover for the first location.
    const popoverFinder = await mapPage.showFirstLocation();

    // Ensure that the popover is displayed.
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
     * Dismissing the popover by clicking on its backdrop.
     */

    await mapPage.closePopover();

    /**
     * Navigating to the Actions List page by clicking on the adequate button on the Map page.
     */

    // Resize the window size small enough to force a scroll in the Actions List Page
    await setWindowSize(600, 400);

    // Go to the actions list page.
    actionsListPage = await mapPage.goToActionList();

    // Wait for the actions list page to show up on the DOM
    const actionsListPageFinder = actionsListPage.getPage();
    await presenceOf(actionsListPageFinder);
    await expectDisplayed(actionsListPageFinder, { elementName: 'ActionsList Page' });

    // Ensure that the navbar title is indeed the expected title.
    await actionsListPage.expectTitle();

    // Ensure that there are as many actions on the page as there are in the database
    let actionListItemsFinder = await actionsListPage.getActionListItems();
    expect(actionListItemsFinder).to.have.lengthOf(5);

    /**
     * Scrolling to the bottom of the actions list page and trigger a new load.
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

    const actionPageFinder = actionPage.getPage();

    // Ensure that the navbar title is indeed the expected title.
    await actionPage.expectTitle();

    // Ensure that the content of the page matches the action data
    const actionDetailsText = await actionPage.getActionDetails().getText();
    expect(actionDetailsText).to.have.string(actions[0].get('title'));
    expect(actionDetailsText).to.have.string(actions[0].get('description'));

    /**
     * Clicking on the theme on the action page, and thus displaying the correct Theme page.
     */

    // Click on the theme
    themePage = await actionPage.goToTheme();

    // Wait for the Theme page to show up onto the DOM
    const themePageFinder = await themePage.getPage();
    await presenceOf(themePageFinder);
    await expectDisplayed(themePageFinder, { elementName: 'Theme Page' });
    await invisibilityOf(actionPageFinder);
    await expectDisplayed(actionPageFinder, { elementName: 'Action Page', shouldBeDisplayed: false });

    // Ensure that the navbar title is indeed the expected title.
    await themePage.expectTitle();

    // Ensure that the content of the page matches the theme data.
    const themeDetailsText = await themePage.getThemeDetailsText();
    // @Simon: I don't understand...
    // Withtout a call to `load` before, the call to `related` fetchs a Theme all right, but it'is NOT the theme to which the action is actually related.
    // Why do I need to call `load` THEN `related` to access to correct theme? Isn't `related` supposed to load the related theme, as its name would imply?
    // Plus, calling `load` before `related` would log a request done on the db to `SELECT` the theme from the table.
    // This log is not there when `load` is not called. Does this mean that `related` does not execute any query?
    // If so, how the hell does it load a theme at all?
    await actions[ 0 ].load('theme');
    const theme = await actions[ 0 ].related('theme');
    // This is to detect the above mentioned strange behavior.
    expect(actions[ 0 ].get('theme_id')).to.equal(theme.get('id'));
    expect(themeDetailsText).to.have.string(theme.get('title'));
    expect(themeDetailsText).to.have.string(theme.get('description'));

    /**
     * Clicking on the back button and thus returning to the previous Action page.
     */

    // Click on the back button from the Theme Page
    await themePage.goBack();

    // Ensure that the Action Page shows up in lieu of the Theme Page.
    await absenceOf(themePageFinder);
    await expectDisplayed(actionPageFinder, { elementName: 'Action Page' });
  });

  /**
   * --- Registration scenario ---
   *
   * This end-to-end scenario simulates a user going through the following steps :
   * 1. Navigating to the registration tab page.
   * 2. Complete the registration form and submit it.
   * 3. Navigate to the unregistration tab page.
   * 4. Complete the unregistration form and submit it.
   */
  it('should allow a user to register and unregister', async function() {
    this.timeout(30000);

    /**
     * Navigating to the registration tab page.
     */

    await browser.get('/');

    const homePageFinder = homePage.getPage();
    await presenceOf(homePageFinder);

    // Open the mneu
    const menuButtonFinder = homePage.getMenuButton();
    await elementIsClickable(menuButtonFinder);
    menuButtonFinder.click();

    const menuPageFinder = menuPage.getPage();
    await presenceOf(menuPageFinder);

    // Click on the "Keep in touch" button
    const menuKeepInTouchButtonFinder = menuPage.getKeepInTouchButton();
    await elementIsClickable(menuKeepInTouchButtonFinder);
    menuKeepInTouchButtonFinder.click();
    // ...and again... ಠ╭╮ಠ
    await browser.sleep(1);

    // Check that the correct pages are displayed
    const registrationTabsPageFinder = await registrationTabsPage.getPage();
    await presenceOf(registrationTabsPageFinder);
    await expect(registrationTabsPage.getTitle().getText()).to.eventually.be.equal(registrationTabsPage.expectedTitle);

    const registerPageFinder = await registerPage.getPage();
    await visibilityOf(registerPageFinder);
    await expect(registrationTabsPage.getActiveTab().getText()).to.eventually.equal(registerPage.expectedTitle);

    // Check that the state of the form is correct
    const registerFormFinder = await registerPage.getForm();
    const registerSuccessFinder = await registerPage.getRegistrationSuccess();
    await expectDisplayed(registerFormFinder, { elementName: 'Registration Form' });
    await expectDisplayed(registerSuccessFinder, { elementName: 'Registration Success', shouldBeDisplayed: false });

    /**
     * Complete the registration form and submit it.
     */

    const submittedRegistration = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe'
    };

    const registrationEmailInputFinder = await registerPage.getEmailInput();
    const registrationFirstNameInputFinder = await registerPage.getFirstNameInput();
    const registrationLastNameInputFinder = await registerPage.getLastNameInput();
    await registrationEmailInputFinder.clear().sendKeys(submittedRegistration.email);
    await registrationFirstNameInputFinder.clear().sendKeys(submittedRegistration.firstName);
    await registrationLastNameInputFinder.clear().sendKeys(submittedRegistration.lastName);

    const registrationSubmitButton = await registerPage.getFormSubmitButton();
    await elementIsClickable(registrationSubmitButton);
    registrationSubmitButton.click();

    // Check that the registration has been saved and the state of the forme has changed
    await invisibilityOf(registerFormFinder);
    await expectDisplayed(registerSuccessFinder);

    // Check that the saved registration matches the provided information
    await expect(registerPage.getRegisteredEmail()).to.eventually.equal(submittedRegistration.email);
    await expect(registerPage.getRegisteredFirstName()).to.eventually.equal(submittedRegistration.firstName);
    await expect(registerPage.getRegisteredLastName()).to.eventually.equal(submittedRegistration.lastName);

    /**
     * Navigate to the unregistration tab page.
     */

    const unregistrationTabFinder = await registrationTabsPage.getSecondTab();
    await elementIsClickable(unregistrationTabFinder);
    unregistrationTabFinder.click();

    await invisibilityOf(registerPageFinder);

    const unregisterPageFinder = await unregisterPage.getPage();
    await visibilityOf(unregisterPageFinder);
    await expect(registrationTabsPage.getActiveTab().getText()).to.eventually.equal(unregisterPage.expectedTitle);

    // Check that the state of the form is correct

    const unregisterFormFinder = await unregisterPage.getForm();
    const unregisterSuccessFinder = await unregisterPage.getSuccessFinder();
    await expectDisplayed(unregisterFormFinder, { elementName: 'Unregistration Form' });
    await expectDisplayed(unregisterSuccessFinder, { elementName: 'Unregistration Success', shouldBeDisplayed: false });

    /**
     * Complete the unregistration form and submit it.
     */

    const unregisterEmailInputFinder = await unregisterPage.getEmailInput();
    await unregisterEmailInputFinder.clear().sendKeys(submittedRegistration.email);
    // This is needed so that the submit button becomes active and can then be selected and clicked.
    await unregisterEmailInputFinder.sendKeys(protractor.Key.TAB);

    const unregisterSubmitButton = await unregisterPage.getSubmitButton();
    await elementIsClickable(unregisterSubmitButton);
    unregisterSubmitButton.click();

    await invisibilityOf(unregisterFormFinder);
    await expectDisplayed(unregisterSuccessFinder, { elementName: 'Unregistration Success' });
  });
});
