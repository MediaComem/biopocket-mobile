import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { assign } from 'lodash';

import Action from '@models/action';
import { ThemePage } from '@pages/theme/theme';
import ActionsService from '@providers/actions-service/actions-service';

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[ActionPage]';

@Component({
  selector: 'action-page',
  templateUrl: 'action.html'
})
export class ActionPage {

  action: Action;
  themePage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private readonly actionService: ActionsService
  ) {
    this.action = new Action(this.navParams.get('action'));
    this.themePage = ThemePage;
  }

  ionViewDidEnter() {
    this.actionService.fetchAction(this.action.id)
      .subscribe(result => assign(this.action, result));
  }
}
