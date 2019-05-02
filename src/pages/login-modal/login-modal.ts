import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { UserCredentials } from '@models/user.interface';
import { AuthService } from '@providers/auth-service/auth-service';

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModal {

  credentials: UserCredentials;

  constructor(
    public viewCtrl: ViewController,
    private readonly authService: AuthService
  ) { 
    this.credentials = {
      email: '',
      password: ''
    };
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    this.authService.logIn(this.credentials).subscribe(function(result) {
      console.log(result);
    });
  }
}