# `bip-profile-picture` component

This component displays a card containing an action's information. The result should (currently) look like the following:

![action card example][actioncard]

It's destined to be used in the ActionsList Page and, ultimately, in the Dashboard and the suggested Actions modal.

## Attributes

| Name | Type | Details |
|:--- | :--- | :--- |
| `action` | `Action` | An Action instance, with its corresponding Theme instance attached to a `theme` property. |

## Usage example

## Usage

```ts
// example.js
import { Component } from '@angular/core';
import Action from '@classes/menu-item-icon.class';

@Component({
  selector: 'example',
  templateUrl: 'example.html'
})
export class ExampleComponent {

  actionObject: Action;

  constructor() {
    this.actionObject = new Action({ /* construct a new Action */ });
  }
}
```

```html
<!-- example.html -->
<div>
  <bip-action-card [action]="actionObject"></bip-menu-item>
</div>
```

[actioncard]: ../img/action-card-example.png
