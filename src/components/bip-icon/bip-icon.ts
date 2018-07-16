import { Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';

/**
 * Component that displays an icon from the biopocket icon set.
 * * To select which icon the component should display, provide a
 *   value for the `name` attribute that matches one of the icon's name.
 * * To apply a color to the icon, you have to options:
 *   1. apply a CSS style to the `bip-icon` element manually
 *   2. provide a value for the `color` attribute, matching any of the color
 *      in the $colors SCSS map.
 */
@Component({
  selector: 'bip-icon',
  templateUrl: 'bip-icon.html',
  host: {
    role: 'img'
  }
})
export class BipIconComponent implements OnInit {

  componentName: string;

  /**
   * REQUIRED.
   * The name of the icon that the component should display.
   * Must be one of the available biopocket icon.
   */
  @Input('name')
  iconName: string;

  /**
   * OPTIONAL.
   * The name of the color to apply to the icon.
   * Must be one of the available colors in the $colors SCSS map.
   */
  @Input()
  set color(val: string) {
    if (val) {
      this.setColorClass(val);
    }
  }

  constructor(
    readonly el: ElementRef,
    readonly renderer: Renderer
  ) {
    this.componentName = 'bip-icon';
  }

  ngOnInit() {
    // Ensure that a value has been provided for the name attribute.
    if (!this.iconName) {
      throw new Error(`A '${this.componentName}' tag requires a value for its 'name' attribute.`);
    }
  }

  /**
   * Sets the color of the element by adding a new class to it.
   * The added class will have the name '<color>-color'.
   * @param color The name of the color.
   */
  protected setColorClass(color: string) {
    this.addClassToElement(color, 'color');
  }

  /**
   * Adds a CSS class to the `element` (by default, it's the component `nativeElement`).
   * The name of the class will be the concatenation of `color` and `sufix` param values.
   * @param className The class base name.
   * @param sufix A sufix to the class base name.
   * @param element The element to which add the new CSS class. Defaults to `this.el.nativeElement`.
   */
  protected addClassToElement(className: string, sufix?: string, element = this.el.nativeElement) {
    let fullClassName = className;
    if (sufix) {
      fullClassName = `${fullClassName}-${sufix}`;
    }
    this.renderer.setElementClass(element, fullClassName, true);
  }
}
