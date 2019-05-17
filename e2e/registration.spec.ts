import { browser, protractor } from 'protractor';

import { expect } from '../spec/chai';
import { elementIsClickable, expectDisplayed, invisibilityOf, presenceOf, setWindowSize, visibilityOf } from './utils';

import { HomePageObject } from './po/home.po';
import { MenuPageObject } from './po/menu.po';
import { RegisterPageObject } from './po/register.po';
import { RegistrationTabsPageObject } from './po/registration-tab.po';
import { UnregisterPageObject } from './po/unregister.po';

describe('Registration module', () => {

  let homePage: HomePageObject;
  let menuPage: MenuPageObject;
  let registrationTabsPage: RegistrationTabsPageObject;
  let registerPage: RegisterPageObject;
  let unregisterPage: UnregisterPageObject;

  beforeEach(async () => {
    menuPage = new MenuPageObject();
    homePage = new HomePageObject();
    registrationTabsPage = new RegistrationTabsPageObject();
    registerPage = new RegisterPageObject();
    unregisterPage = new UnregisterPageObject();

    await setWindowSize(1440, 900);
  });

  it.skip('should allow a user to register and unregister', async function() {
    this.timeout(30000);

    /**
     * Navigating to the registration tab page.
     */

    await browser.get('/');

    const homePageFinder = homePage.getPage();
    await presenceOf(homePageFinder, 'Home page');

    // Open the mneu
    const menuButtonFinder = homePage.getMenuButton();
    await elementIsClickable(menuButtonFinder);
    menuButtonFinder.click();

    const menuPageFinder = menuPage.getPage();
    await presenceOf(menuPageFinder, 'Menu page');

    // Click on the "Keep in touch" button
    const menuKeepInTouchButtonFinder = menuPage.getKeepInTouchButton();
    await elementIsClickable(menuKeepInTouchButtonFinder);
    await browser.actions().mouseMove(menuKeepInTouchButtonFinder).click().perform();
    // menuKeepInTouchButtonFinder.click();
    // ...and again... ಠ╭╮ಠ
    await browser.sleep(1);

    // Check that the correct pages are displayed
    const registrationTabsPageFinder = await registrationTabsPage.getPage();
    await presenceOf(registrationTabsPageFinder, 'Registration tabs page');
    await expect(registrationTabsPage.getTitle().getText()).to.eventually.be.equal(registrationTabsPage.expectedTitle);

    const registerPageFinder = await registerPage.getPage();
    await visibilityOf(registerPageFinder, 'Register page');
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
    await invisibilityOf(registerFormFinder, 'Register form');
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

    await invisibilityOf(registerPageFinder, 'Register page');

    const unregisterPageFinder = await unregisterPage.getPage();
    await visibilityOf(unregisterPageFinder, 'Unregister page');
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

    await invisibilityOf(unregisterFormFinder, 'Unregister form');
    await expectDisplayed(unregisterSuccessFinder, { elementName: 'Unregistration Success' });
  });
});
