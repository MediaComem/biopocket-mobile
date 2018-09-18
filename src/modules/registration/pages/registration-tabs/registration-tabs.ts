import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { UnregisterPage } from '../unregister/unregister';

@Component({
  selector: 'registration-tabs-page',
  templateUrl: 'registration-tabs.html'
})
export class RegistrationTabsPage {

  registerTab: any;
  unregisterTab: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.registerTab = RegisterPage;
    this.unregisterTab = UnregisterPage;
  }

}
