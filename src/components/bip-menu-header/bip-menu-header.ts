import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RegistrationTabsPage } from 'modules/registration/pages/registration-tabs/registration-tabs';

import { User } from '../../models/user.interface';

/**
 * Component that displays the content of the menu header.
 * That is :
 * * The profile picture
 * * The user name
 * * The four action buttons
 */
@Component({
  selector: 'bip-menu-header',
  templateUrl: 'bip-menu-header.html'
})
export class BipMenuHeaderComponent implements OnInit {

  @Input() user: Partial<User>;
  @Output() goToPage: EventEmitter<any>;
  @Output() openLoginModal: EventEmitter<void>;

  registrationPage: any;

  constructor() {
    this.registrationPage = RegistrationTabsPage;
    this.goToPage = new EventEmitter<any>();
    this.openLoginModal = new EventEmitter<void>();
  }

  ngOnInit(): void {
    if (!this.user) {
      throw new Error("A 'bip-menu-header' component requires a value for its 'user' attribute.");
    }
  }

  activate(page: any) {
    this.goToPage.emit(page);
  }

  showLoginModal() {
    this.openLoginModal.emit();
  }
}
