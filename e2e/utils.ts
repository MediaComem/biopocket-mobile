import chalk from 'chalk';
import { compact } from 'lodash';

import { cleanDatabase, setUp as setUpBackend } from '../backend/server/spec/utils';
import { ENV } from '../src/environments/environment.test';
import { StandaloneBackendProcess } from './standalone/backend';
import { IONIC_URL, StandaloneIonicProcess } from './standalone/ionic';
import { StandaloneProcess } from './standalone/utils';

/**
 * An object that has an array of coordinates (e.g. a GeoJSON point, or something that looks like it).
 */
export interface WithCoordinates {
  coordinates: number[];
}

/**
 * Compares GeoJSON-Point-like objects in order of ascending longitude and latitude (in that order).
 */
export function compareCoordinates(a: WithCoordinates, b: WithCoordinates) {
  const longitudeComparison = a.coordinates[0] - b.coordinates[0];
  if (longitudeComparison !== 0) {
    return longitudeComparison;
  } else {
    return a.coordinates[1] - b.coordinates[1];
  }
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
export function getEnvInteger(name, defaultValue = undefined, validate = v => true) {

  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }

  const intValue = parseInt(value);
  if (isNaN(intValue)) {
    throw new Error(`Value of $${name} is not a valid integer: "${value}"`);
  }

  const valid = validate(value);
  if (valid !== true) {
    throw new Error(`Value of $${name} is invalid${typeof(valid) === 'string' ? ': ' + valid : ''}`);
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
