/* tslint:disable:no-console */
import { ENV } from '@app/env';

/**
 * An array of string, each of which is the name of an environment in which this service will log on the console
 */
const whitelist = [
  'development'
];

/**
 * This Object provides all the methods of the javascript console Class,
 * but each is decorated so that it only actually log anything if the app's environment is allowed to do so.
 */
const Print = {

  log(...values: any[]): void {
    if (isAllowed(ENV.environment)) {
      console.log(values[0], ...values.slice(1));
    }
  },

  debug(...values: any[]): void {
    if (isAllowed(ENV.environment)) {
      console.debug(values[0], ...values.slice(1));
    }
  },

  warn(...values: any[]): void {
    if (isAllowed(ENV.environment)) {
      console.warn(values[0], ...values.slice(1));
    }
  },

  error(...values: any[]): void {
    if (isAllowed(ENV.environment)) {
      console.error(values[0], ...values.slice(1));
    }
  }

};

/**
 * Indicates wether or not the given `env` string matches any of the whitelisted environments
 * @param {string} env The environment name 
 * @returns {boolean}
 */
function isAllowed(env: string): boolean {
  return whitelist.indexOf(env) !== -1;
}

export default Print;
