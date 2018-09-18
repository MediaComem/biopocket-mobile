import { Component } from '@angular/core';

@Component({ selector: 'registration-form', template: '' })
export class RegistrationFormStubComponent {

  registration: any;
  submitted: any;
  error: any;

  private readonly registrationService: any;
  private readonly toast: any;
  private readonly clipboard: any;
  private readonly globalization: any;
  private readonly translateService: any;

  ngOnInit() {
    return null;
  }

  onSubmit(registrationForm: any): void {
    return registrationForm;
  }

  copyRegistrationToClipboard() {
    return null;
  }

}
