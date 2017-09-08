import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  date: Date;

  constructor(public navCtrl: NavController) {
    this.date = new Date();
  }

}
