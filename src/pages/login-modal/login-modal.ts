import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewController } from 'ionic-angular';

import { UserCredentials } from '@models/user.interface';

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModal {

  credentials: UserCredentials;

  constructor(
    public viewCtrl: ViewController
  ) { 
    this.credentials = {
      username: '',
      password: ''
    };
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSubmit(login: NgForm) {
    console.log(login);
    console.log(this.credentials);
  }
}