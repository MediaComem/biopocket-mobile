import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UnregistrationFormComponent } from '../../components/unregistration-form/unregistration-form';

@Component({
  selector: 'unregister-page',
  templateUrl: 'unregister.html'
})
export class UnregisterPage {

  @ViewChild(UnregistrationFormComponent) unregistrationForm: UnregistrationFormComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLeave() {
    this.unregistrationForm.showForm();
  }

}
