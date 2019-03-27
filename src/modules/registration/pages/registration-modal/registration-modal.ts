import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'registration-modal',
  templateUrl: 'registration-modal.html'
})
export class RegistrationModal {

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) { }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
