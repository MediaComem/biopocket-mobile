import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { User, UserCredentials } from '@models/user.interface';
import { AuthService } from '@providers/auth-service/auth-service';

@Component({
  selector: 'login-modal',
  templateUrl: 'login-modal.html'
})
export class LoginModal {

  credentials: UserCredentials;
  user: User;
  authFail: any;

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
    this.authService.logIn(this.credentials).subscribe(
      data => this.handleAuthSuccess(data), 
      error => this.handleAuthError(error)
    );
  }

  private handleAuthSuccess(data) {
    this.user = data;
    this.dismiss();
  }

  private handleAuthError(result) {
    this.authFail = result.error;
  }
}