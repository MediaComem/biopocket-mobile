import { Component, Input, OnInit } from '@angular/core';

import { Action } from '@models/action';
import { ActionPage } from '@pages/action/action';

@Component({
  selector: 'bip-action-card',
  templateUrl: 'bip-action-card.html'
})
export class BipActionCardComponent implements OnInit {

  @Input() action: Action;

  ngOnInit(): void {
    if (!this.action) {
      throw new Error("A 'bip-action-card' tag requires an Action as it's 'action' attribute value.");
    }
  }
}
