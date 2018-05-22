import extend from 'lodash/extend';
import pick from 'lodash/pick';

/**
 * Model for the information about the current API version used by the BioPocket API backend
 * @property {string} version The current API version number
 */
export class ApiVersion {

  version: string;

  /**
   * Creates a new ApiVersion object
   * @param {{version: string}} data An object with at least a `version` property
   */
  constructor(data: any) {
    extend(this, pick(data || {}, 'version'));
  }

}
