import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';

import { ComponentsModule } from '@components/components.module';
import { translateModuleForRoot } from '@utils/i18n';
import { InputStateIndicatorComponent } from './components/input-state-indicator/input-state-indicator';
import { RegistrationFormComponent } from './components/registration-form/registration-form';
import { UnregistrationFormComponent } from './components/unregistration-form/unregistration-form';
import { EmailExistenceValidator } from './directives/email-existence/email-existence';
import { RegisterPage } from './pages/register/register';
import { RegistrationModal } from './pages/registration-modal/registration-modal';
import { RegistrationTabsPage } from './pages/registration-tabs/registration-tabs';
import { UnregisterPage } from './pages/unregister/unregister';
import { RegistrationService } from './providers/registration/registration';

@NgModule({
  imports: [
    CommonModule,
    translateModuleForRoot,
    FormsModule,
    ComponentsModule,
    IonicModule
  ],
  declarations: [
    InputStateIndicatorComponent,
    RegistrationFormComponent,
    UnregistrationFormComponent,
    RegistrationModal,
    EmailExistenceValidator,
    RegistrationTabsPage,
    UnregisterPage,
    RegisterPage
  ],
  exports: [ RegistrationModal ],
  providers: [ RegistrationService ],
  entryComponents: [
    RegistrationModal,
    RegistrationTabsPage,
    UnregisterPage,
    RegisterPage
  ]
})
export class RegistrationModule { }
