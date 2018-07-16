import { Component, Input, OnInit } from '@angular/core';

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

  // TODO: replace `any` with a suitable User type when it will be created.
  @Input('user') user: any;

  ngOnInit(): void {
    if (!this.user) {
      throw new Error("A 'bip-menu-header' component requires a value for its 'user' attribute.");
    }
  }

}
