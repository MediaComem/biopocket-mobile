import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'bip-input-state-indicator',
  templateUrl: 'bip-input-state-indicator.html'
})
export class BipInputStateIndicatorComponent implements OnInit {

  @Input('input') inputModel;

  ngOnInit() {
    if (this.inputModel === undefined) {
      throw new Error("An 'bip-input-state-indicator' tag requires a value for its 'input' attribute.");
    }
  }

}
