import { browser, ElementFinder, ExpectedConditions as EC } from 'protractor';

import { expect } from '../spec/chai';

/**
 * Timeout value for DOM fetching operation.
 * No transition or animation on DOM element should take more than 5 secondes to finish.
 */
export const AVERAGE_WAIT_TIME = 5000;

/**
 * An object that has an array of coordinates (e.g. a GeoJSON point, or something that looks like it).
 */
export interface WithCoordinates {
  coordinates: number[];
}

/**
 * Returns a promise that will be resolved when the browser windows has been resized according to the provided width and height.
 * @param width The targeted width.
 * @param height The targeted height.
 */
export async function setWindowSize(width: number, height: number): Promise<void> {
  await browser.driver.manage().window().setSize(width, height);
}

/**
 * Compares GeoJSON-Point-like objects in order of ascending longitude and latitude (in that order).
 */
export function compareCoordinates(a: WithCoordinates, b: WithCoordinates) {
  const longitudeComparison = a.coordinates[0] - b.coordinates[0];
  return longitudeComparison !== 0 ? longitudeComparison : a.coordinates[1] - b.coordinates[1];
}

/**
 * Returns the boolean value of an environment variable.
 *
 * It is considered true if its value is "1", "y", "yes", "t" or "true". The comparison is
 * case-insensitive.
 *
 * @param name The name of the environment variable.
 * @param defaultValue The value returned if the environment variable is not set.
 */
export function getEnvBoolean(name, defaultValue = false) {
  return process.env[name] === undefined ? defaultValue : !!process.env[name].match(/^(?:1|y|yes|t|true)$/i);
}

/**
 * Returns the integer value of an environment variable.
 *
 * An error is thrown if the value is not a valid integer, or if the provided `validate` function
 * does not return true.
 *
 * @param name The name of the environment variable.
 * @param defaultValue The value returned if the environment variable is not set.
 * @param validate A function which should return true if the parsed integer is valid, or false or
 * an error message string if it is invalid (it always returns true by default). There is no need to
 * check whether the value is an integer, as that is checked before invoking this function.
 */
export function getEnvInteger(name, defaultValue?, validate: (v: any) => boolean = () => true) {

  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }

  const intValue = parseInt(value, 10);
  if (isNaN(intValue)) {
    throw new Error(`Value of $${name} is not a valid integer: "${value}"`);
  }

  const valid = validate(value);
  if (valid !== true) {
    throw new Error(`Value of $${name} is invalid${typeof (valid) === 'string' ? `: ${valid}` : ''}`);
  }

  return intValue;
}

/**
 * Indicates whether debug output for end-to-end tests is enabled. This is determined by the value
 * of the `$IONIC_E2E_DEBUG` variable, and defaults to false.
 */
export function isDebugEnabled() {
  return getEnvBoolean('IONIC_E2E_DEBUG', false);
}

/**
 * Makes the browser wait for the given `finder` to be present on the DOM.
 * This times out by default after 5 secondes, or the given `timeout` value.
 * @param finder An element finder.
 * @param {Number} [timeout=5000] The number of millisecondes after which the browser stops waiting. Defaults to `5000`.
 */
export function presenceOf(finder: ElementFinder, element = 'requested element', timeout = AVERAGE_WAIT_TIME) {
  return browser.wait(EC.presenceOf(finder), timeout, `The ${element} was not present in the DOM after ${timeout}ms`);
}

/**
 * Make the browser wait for the given `finder` to be absent from the DOM.
 * This times out by default after 5 secondes, or the given `timeout` value.
 * @param finder An element finder.
 * @param {Number} [timeout=5000] The number of millisecondes after which the browser stops waiting. Defaults to `5000`.
 */
export function absenceOf(finder: ElementFinder, element = 'requested element', timeout = AVERAGE_WAIT_TIME) {
  return browser.wait(EC.stalenessOf(finder), timeout, `The ${element} was not absent from the DOM after ${timeout}ms`);
}

/**
 * Make the browser wait for the given `finder` to be visible on the page.
 * This times out by default after 5 secondes, or the given `timeout` value.
 * @param finder An element finder.
 * @param {Number} [timeout=5000] The number of millisecondes after which the browser stops waiting. Defaults to `5000`.
 */
export function visibilityOf(finder: ElementFinder, element = 'requested element', timeout = AVERAGE_WAIT_TIME) {
  return browser.wait(EC.visibilityOf(finder), timeout, `The ${element} was not visible on the screen after ${timeout}ms`);
}

export function invisibilityOf(finder: ElementFinder, element = 'requested element', timeout = AVERAGE_WAIT_TIME) {
  return browser.wait(EC.invisibilityOf(finder), timeout, `The ${element} was still visibile on the screen after ${timeout}ms`);
}

/**
 * Expect that the given `finder` is displayed/visible (or instead hidden) on the DOM.
 * By default, expect the `finder` to be displayed. Pass `false` as second param to expect it to be hidden.
 * @param finder An element finder.
 * @param
 */
export async function expectDisplayed(finder: ElementFinder, options: { elementName?: string; shouldBeDisplayed?: boolean } = {}) {
  if (options.elementName === undefined) {
    options.elementName = 'Element';
  }
  if (options.shouldBeDisplayed === undefined) {
    options.shouldBeDisplayed = true;
  }

  const message = options.shouldBeDisplayed ? `${options.elementName} is not displayed while it should be` : `${options.elementName} is displayed while it shouldn\'t be`;
  const isDisplayed = await finder.isDisplayed();
  // console.log(`${options.elementName} displayed ?`, isDisplayed);
  // console.log(`${options.elementName} should be displayed ?`, options.shouldBeDisplayed);
  expect(isDisplayed, message).to.equal(options.shouldBeDisplayed);
}

export async function elementIsClickable(element: ElementFinder) {
  return browser.wait(EC.elementToBeClickable(element), AVERAGE_WAIT_TIME);
}
