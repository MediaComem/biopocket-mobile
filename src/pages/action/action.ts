import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import Action from '@models/action';

@Component({
  selector: 'page-action',
  templateUrl: 'action.html'
})
export class ActionPage {

  action: Action;
  params: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.params = this.navParams.get('action');
  }

}
