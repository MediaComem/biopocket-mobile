import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-state-indicator',
  templateUrl: 'input-state-indicator.html'
})
export class InputStateIndicatorComponent implements OnInit {

  @Input('input') inputModel;

  ngOnInit() {
    if (this.inputModel === undefined) {
      throw new Error("An 'input-state-indicator' tag requires a value for its 'input' attribute.");
    }
  }

}
