import { Component } from '@angular/core';
import { stub } from 'sinon';

@Component({ selector: 'registration-form', template: '' })
export class RegistrationFormStubComponent {

  registration: any;
  submitted: any;
  error: any;

  ngOnInit: () => void;
  onSubmit: (registrationForm: any) => void;
  copyRegistrationToClipboard: () => void;

  constructor() {
    this.ngOnInit = stub();
    this.onSubmit = stub();
    this.copyRegistrationToClipboard = stub();
  }

}
