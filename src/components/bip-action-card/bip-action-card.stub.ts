import { Component, Input } from '@angular/core';

import { Action } from '@models/action';

@Component({ selector: 'bip-action-card', template: '' })
export class BipActionCardStub {
  @Input() action: Action;
}
