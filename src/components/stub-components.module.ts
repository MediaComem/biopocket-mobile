import { NgModule } from '@angular/core';

import { BipIconStub as BipIconComponent } from '@components/bip-icon/bip-icon.stub';
import { BipMenuHeaderStub as BipMenuHeaderComponent } from '@components/bip-menu-header/bip-menu-header.stub';
import { BipMenuItemIconStub as BipMenuItemIconComponent } from '@components/bip-menu-item-icon/bip-menu-item-icon.stub';
import { BipMenuItemStub as BipMenuItemComponent } from '@components/bip-menu-item/bip-menu-item.stub';
import { BipProfilePictureStub as BipProfilePictureComponent } from '@components/bip-profile-picture/bip-profile-picture.stub';

/**
 * This module should be used in replacement of the component module when testing pages or other
 * components that use the custom components defined in the `src/components` folder.
 * Since the module should stub the real module, notice how components' stubs are imported with the
 * same name as the real components.
 *
 * You should update this module whenever you add a new custom component or create a new component's stub.
 */
@NgModule({
  declarations: [
    BipIconComponent,
    BipMenuHeaderComponent,
    BipMenuItemComponent,
    BipMenuItemIconComponent,
    BipProfilePictureComponent
  ],
  exports: [
    BipIconComponent,
    BipMenuHeaderComponent,
    BipMenuItemComponent,
    BipMenuItemIconComponent,
    BipProfilePictureComponent
  ]
})

export class StubComponentsModule { }
