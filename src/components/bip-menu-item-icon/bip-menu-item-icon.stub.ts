import { Component, Input } from '@angular/core';

import { BipIconStub } from '@components/bip-icon/bip-icon.stub';

/**
 * This stub component should be used in tests where another component's template uses `bip-menu-item-icon` elements.
 * Import this class and add it to the `declarations` array.
 * If your test needs to stub multiple components, you should probably import the `StubComponentsModule` instead and add it to the `import` array.
 */
@Component({ selector: 'bip-menu-item-icon', template: '' })
export class BipMenuItemIconStub extends BipIconStub {

  componentName: string;
  @Input('bg-color') backgroundColor: string;

}
