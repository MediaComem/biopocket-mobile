import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ThemePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-theme',
  templateUrl: 'theme.html'
})
export class ThemePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) { }

  ionViewDidLoad() {
    // tslint:disable-next-line:no-console
    console.log('ionViewDidLoad ThemePage', this.navParams.get('theme'));
  }

}
