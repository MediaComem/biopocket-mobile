# `bip-menu-item` component

This component displays a menu item in the app's main menu, composed of a `bip-menu-item-icon` and a label.

The label must be put inside the component's tag.

> Note that you can put any sort of HTML structure inside the component's tag, although it has not been designed to properly handle complex HTML structure.

## Attributes

| Name   | Type           | Details                                                                                                                                                       |
|:---    | :---           | :---                                                                                                                                                          |
| `icon` | `MenuItemIcon` | An instance of `MenuItemIcon`. Its `name`, `color` and `bgColor` properties will be passsed to the underlying [`bip-menu-item-icon` component][bmiic]. |

## Usage

```ts
// example.js
import { Component } from '@angular/core';
import MenuItemIcon from '@classes/menu-item-icon.class';

@Component({
  selector: 'example',
  templateUrl: 'example.html'
})
export class ExampleComponent {

  itemIcon: MenuItemIcon;
  label: string;

  constructor() {
    this.itemIcon = new MenuItemIcon('spiral', 'wood', 'dark');
    this.label = "Example menu item";
  }
}
```

```html
<!-- example.html -->
<div>
  <bip-menu-item [icon]="itemIcon">{{ label }}</bip-menu-item>
</div>
```

[bmiic]: ./bip-menu-item-icon.md
