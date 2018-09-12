/**
 * This class encapsulate data relative to a menu item icon.
 */
export class MenuItemIcon {

  /**
   * @constructor
   * @param {String} name A string referencing an icon from the BioPocket icon set.
   * @param {String} [bgColor] Optional. A string referencing a BioPocket color to apply to the background of the menu item icon.
   * @param {String} [color] Optional. A string referencing a BioPocket color to apply to the foregroune of the menu item icon.
   */
  constructor(
    public name: string,
    public bgColor?: string,
    public color?: string
  ) { }

}
