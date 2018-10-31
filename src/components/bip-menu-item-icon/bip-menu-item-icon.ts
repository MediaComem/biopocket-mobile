import { Component, ElementRef, Input, Renderer } from '@angular/core';

import { BipIconComponent } from '@components/bip-icon/bip-icon';

/**
 * Component that displays a menu item icon.
 * Should obviously be used alongside menu items.
 * * To select which icon the component should display, provide a
 *   value for the `name` attribute that matches one of the icons' name.
 *   Failure to do so will result in a runtime error.
 * * To apply a color to the icon, you can provide a value for the `color` attribute,
 *   matching any of the color in the $colors SCSS map.
 *   Please note that if no `color` is provided, the icon will have the 'light' color.
 * * To apply a background-color to the component, you can provide a value for the `bg-color`
 *   attribute, matching any of the color in the $colors SCSS map.
 *   Please note that if no `bg-color` is provided, the component will have the 'primary' background color.
 */
@Component({
  selector: 'bip-menu-item-icon',
  templateUrl: 'bip-menu-item-icon.html'
})
export class BipMenuItemIconComponent extends BipIconComponent {

  componentName: string;

  /**
   * OPTIONAL.
   * The name of the background color to apply to the component.
   * Must be one of the available colors in the $colors SCSS map.
   */
  @Input('bg-color')
  set backgroundColor(val: string) {
    if (val) {
      this.setBgColorClass(val);
    }
  }

  constructor(
    readonly el: ElementRef,
    readonly renderer: Renderer
  ) {
    super(el, renderer);
    this.componentName = 'bip-menu-item-icon';
  }

  /**
   * Sets the background color of the element by adding a new class to it.
   * The added class will have the name '<color>-bg-color'.
   * @param bgColor The name of the color.
   */
  protected setBgColorClass(bgColor: string) {
    this.addClassToElement(bgColor, 'bg-color');
  }

}
