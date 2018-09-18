import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { assign } from 'lodash';

import { Action } from '@models/action';
import { ThemePage } from '@pages/theme/theme';
import { ActionsService } from '@providers/actions-service/actions-service';
import { RegistrationModal } from 'modules/registration/pages/registration-modal/registration-modal';

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[ActionPage]';

@Component({
  selector: 'action-page',
  templateUrl: 'action.html'
})
export class ActionPage {

  action: Action;
  ThemePage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private readonly actionService: ActionsService
  ) {
    this.action = new Action(this.navParams.get('action'));
    this.ThemePage = ThemePage;
  }

  ionViewDidEnter() {
    this.actionService.fetchAction(this.action.id)
      .subscribe(result => assign(this.action, result));
  }

  presentRegistrationModal() {
    const registrationModal = this.modalCtrl.create(RegistrationModal, {}, {
      cssClass: 'registration-modal'
    });
    registrationModal.present();
  }
}
