import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { BipIconComponent } from '@components/bip-icon/bip-icon';
import { BipMenuHeaderComponent } from '@components/bip-menu-header/bip-menu-header';
import { translateModuleForRoot } from '@utils/i18n';
import { BipActionCardComponent } from './bip-action-card/bip-action-card';
import { BipMenuItemIconComponent } from './bip-menu-item-icon/bip-menu-item-icon';
import { BipMenuItemComponent } from './bip-menu-item/bip-menu-item';
import { BipProfilePictureComponent } from './bip-profile-picture/bip-profile-picture';

@NgModule({
  declarations: [
    BipMenuHeaderComponent,
    BipIconComponent,
    BipProfilePictureComponent,
    BipMenuItemIconComponent,
    BipMenuItemComponent,
    BipActionCardComponent
  ],
  imports: [
    IonicModule,
    translateModuleForRoot
  ],
  exports: [
    BipMenuHeaderComponent,
    BipIconComponent,
    BipProfilePictureComponent,
    BipMenuItemIconComponent,
    BipMenuItemComponent,
    BipActionCardComponent
  ]
})

export class ComponentsModule { }
