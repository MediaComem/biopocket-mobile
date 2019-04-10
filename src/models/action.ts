import { extend, pick } from 'lodash';

import { Theme } from '@models/theme';

/**
 * Represents a BioPocket Action
 */
export class Action {

  id: string;
  themeId: string;
  photoUrl: string;
  theme?: Theme;
  title: string;
  description: string;
  impact: string;
  createdAt: Date;
  updatedAt: Date;

  /**
   * Creates a new Action.
   * @param {Object} data - An object containing the values for the new Action.
   */
  constructor(data: any) {
    extend(this, pick(data, 'id', 'themeId', 'photoUrl', 'title', 'description', 'impact'));
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    if (data.theme) {
      this.theme = new Theme(data.theme);
    }
  }

}
