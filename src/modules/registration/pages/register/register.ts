import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegistrationFormComponent } from '../../components/registration-form/registration-form';

@Component({
  selector: 'register-page',
  templateUrl: 'register.html'
})
export class RegisterPage {
  @ViewChild(RegistrationFormComponent) registrationForm: RegistrationFormComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewWillEnter() {
    this.registrationForm.initialize();
  }

}
