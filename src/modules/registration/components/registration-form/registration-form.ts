import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard';
import { Globalization } from '@ionic-native/globalization';
import { Toast } from '@ionic-native/toast';
import { TranslateService } from '@ngx-translate/core';

import { HttpErrorResponse } from '@angular/common/http';
import { Print } from '@print';
import { Registration } from '../../classes/registration';
import { RegistrationService } from '../../providers/registration/registration';

@Component({
  selector: 'registration-form',
  templateUrl: 'registration-form.html'
})
export class RegistrationFormComponent implements OnInit {

  registration: Registration;
  submitted: boolean;
  error: any;

  constructor(
    private readonly registrationService: RegistrationService,
    private readonly toast: Toast,
    private readonly clipboard: Clipboard,
    private readonly globalization: Globalization,
    private readonly translateService: TranslateService
  ) { }

  ngOnInit() {
    this.registration = this.registrationService.registration;
    this.submitted = this.registrationService.userRegistered;
  }

  onSubmit(registrationForm: NgForm): void {
    this.registrationService.sendRegistration(this.registration)
      .subscribe(
        (registration: Registration) => {
          registrationForm.reset();
          this.registration = registration;
          this.submitted = this.registrationService.userRegistered = true;
        },
        (httpError: HttpErrorResponse) => {
          Print.debug(httpError.error);
          this.error = httpError.error;
          this.submitted = this.registrationService.userRegistered = false;
        });
  }

  async copyRegistrationToClipboard() {
    // Convert the registration date to a locale string.
    const date = await this.globalization.dateToString(new Date(this.registration.createdAt), { formatLength: 'short', selector: 'date and time' });
    // Construct the text that will be copied to the user's mobile clipboard.
    const text = `${this.translateService.instant('registration.forms.register.number')}\n\t${this.registration.id}\n${this.translateService.instant('registration.forms.email')}\n\t${this.registration.email}\n${this.translateService.instant('registration.forms.firstname')}\n\t${this.registration.firstname}\n${this.translateService.instant('registration.forms.lastname')}\n\t${this.registration.lastname}\n${this.translateService.instant('registration.forms.register.createdAt')}\n\t${date.value}`;
    await this.clipboard.copy(text);
    this.toast.showShortBottom(this.translateService.instant('registration.forms.register.dataCopied')).subscribe();
  }

}
