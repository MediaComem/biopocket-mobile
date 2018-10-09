import { Component } from '@angular/core';
import { stub } from 'sinon';

@Component({ selector: 'unregistration-form', template: '' })
export class UnregistrationFormStubComponent {

  text: any;
  userEmail: any;
  unregistered: any;
  error: any;
  showForm: () => void;
  onSubmit: () => void;

  constructor() {
    this.showForm = stub();
    this.onSubmit = stub();
  }

}
