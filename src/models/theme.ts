import extend from 'lodash/extend';
import pick from 'lodash/pick';

/**
 * Represents an Action's Theme.
 */
export class Theme {

  id: string;
  title: string;
  description: string;
  photoUrl: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Creates a new Theme.
   * @param {Object} data - An object containing the values for an Action's Theme
   */
  constructor(data: any) {
    extend(this, pick(data, 'id', 'title', 'description', 'photoUrl', 'source'));
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }

}
