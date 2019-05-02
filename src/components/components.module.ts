import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { BipIconComponent } from '@components/bip-icon/bip-icon';
import { BipMenuHeaderComponent } from '@components/bip-menu-header/bip-menu-header';
import { DirectivesModule } from '@directives/directives.module';
import { translateModuleForRoot } from '@utils/i18n';
import { BipActionCardComponent } from './bip-action-card/bip-action-card';
import { BipInputStateIndicatorComponent } from './bip-input-state-indicator/bip-input-state-indicator';
import { BipMenuItemIconComponent } from './bip-menu-item-icon/bip-menu-item-icon';
import { BipMenuItemComponent } from './bip-menu-item/bip-menu-item';
import { BipProfilePictureComponent } from './bip-profile-picture/bip-profile-picture';

const components = [
  BipMenuHeaderComponent,
  BipIconComponent,
  BipProfilePictureComponent,
  BipMenuItemIconComponent,
  BipMenuItemComponent,
  BipActionCardComponent,
  BipInputStateIndicatorComponent
];

@NgModule({
  declarations: components,
  imports: [
    IonicModule,
    translateModuleForRoot,
    DirectivesModule
  ],
  exports: components
})

export class ComponentsModule { }
