# `bip-menu-header` component

This component should only be used to display profile related information and action in the app's main menu.

The displayed result should look like the following:

![bip-menu-header example][bmhexample]

> Please note that this is an ongoing implementation. When user management will be implemented, this component's API will surely change.

## Attributes

| Name   | Type           | Details                                                                                                                                                       |
|:---    | :---           | :---                                                                                                                                                          |
| `user` | `Object` | An object with two properties: `completeName` and `profilePictureUrl` The first one will be displayed as is in the component, the second will be passed to the underlying [`bip-profile-picture` component][bppc]. |

## Usage example

```ts
// example.js
import { Component } from '@angular/core';
import { MenuItemIcon } from '@models/menu-item-icon';

@Component({
  selector: 'example',
  templateUrl: 'example.html'
})
export class ExampleComponent {

  userInfo: any;

  constructor() {
    this.userInfo = {
      completeName: 'Garus Vakarian',
      profilePictureUrl: 'https://pbs.twimg.com/profile_images/1673181320/garrus2_400x400.PNG'
    }
  }
}
```

```html
<!-- example.html -->
<div>
  <bip-menu-header [user]="userInfo"></bip-menu-header>
</div>
```


[bmhexample]: ../img/bip-menu-header-example.png
[bppc]: ./bip-profile-picture.md