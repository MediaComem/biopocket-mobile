import { Component, Input } from '@angular/core';

/**
 * This stub component should be used in tests where another component's template uses `bip-profile-picture` elements.
 * Import this class and add it to the `declarations` array.
 * If your test needs to stub multiple components, you should probably import the `StubComponentsModule` instead and add it to the `imports` array.
 */
@Component({ selector: 'bip-profile-picture', template: '' })
export class BipProfilePictureStub {
  @Input() src: string;
}
