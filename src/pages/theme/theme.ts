import { Component } from '@angular/core';
import { Theme } from '@models/theme';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'theme-page',
  templateUrl: 'theme.html'
})
export class ThemePage {

  theme: Theme;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.theme = this.navParams.get('theme');
  }
}
