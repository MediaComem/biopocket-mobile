import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { RegistrationService } from '../../providers/registration/registration';

@Component({
  selector: 'unregistration-form',
  templateUrl: 'unregistration-form.html'
})
export class UnregistrationFormComponent {

  text: string;
  userEmail: string;
  unregistered: boolean;
  error: any;

  constructor(
    private readonly registrationService: RegistrationService
  ) {
    this.unregistered = false;
  }

  showForm() {
    if (this.unregistered) {
      this.unregistered = false;
    }
  }

  onSubmit(unregistrationForm: NgForm): void {
    this.registrationService.deleteRegistration(this.userEmail)
      .subscribe(
        () => {
          unregistrationForm.reset();
          this.unregistered = true;
        },
        (httpError: HttpErrorResponse) => {
          this.unregistered = false;
          this.error = httpError.error;
        });
  }

}
