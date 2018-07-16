import { Component, Input } from '@angular/core';
import MenuItemIcon from '@classes/menu-item-icon.class';

/**
 * This stub component should be use in tests where another component's template uses `bip-menu-item` elements.
 * Import this class and add it to the `declaration` array.
 * If your test needs to stub multiple components, you should probably import the `StubComponentsModule` instead and add it to the `import` array.
 */
@Component({ selector: 'bip-menu-item', template: '' })
export class BipMenuItemStub {
  @Input() icon: MenuItemIcon;
}
