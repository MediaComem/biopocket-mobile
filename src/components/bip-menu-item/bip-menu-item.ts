import { Component, Input, OnInit } from '@angular/core';

import { MenuItemIcon } from '@models/menu-item-icon';

@Component({
  selector: 'bip-menu-item',
  templateUrl: 'bip-menu-item.html'
})
export class BipMenuItemComponent implements OnInit {

  @Input() icon: MenuItemIcon;

  ngOnInit(): void {
    if (!this.icon) {
      throw new Error("A 'bip-menu-item' tag requires an instance of MenuItemIcon as its 'icon' attribute's value.");
    }
  }

}
