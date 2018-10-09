import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BipMenuItemIconStub as BipMenuItemIconComponent } from '@components/bip-menu-item-icon/bip-menu-item-icon.stub';
import { BipMenuItemComponent } from '@components/bip-menu-item/bip-menu-item';
import { MenuItemIcon } from '@models/menu-item-icon';
import { expect } from '@spec/chai';

/**
 * Since the bip-menu-item component transclude its internal tag content,
 * it's being tested using the 'Test Host' pattern.
 * @see https://angular.io/guide/testing#component-inside-a-test-host
 */
@Component({
  selector: 'test-component',
  template: `
    <div>
      <bip-menu-item [icon]="icon">{{ label }}</bip-menu-item>
    </div>`
})
class TestComponent {

  icon: MenuItemIcon;
  label: string;

  constructor() {
    this.icon = null; // new MenuItemIcon('repeat', 'grass', 'grey');
    this.label = 'Menu item label';
  }
}

describe('BipMenuItem', () => {

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestComponent, BipMenuItemComponent, BipMenuItemIconComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it("should raise an error if no 'icon' value is provided", function() {
    expect(() => fixture.detectChanges()).to.throw(Error, "A 'bip-menu-item' tag requires an instance of MenuItemIcon as its 'icon' attribute's value.");
  });

  describe("with an 'icon' object", () => {

    let bipMenuItemEl: HTMLElement;

    beforeEach(() => {
      component.icon = new MenuItemIcon('repeat', 'grass', 'grey');
      fixture.detectChanges();
      bipMenuItemEl = fixture.nativeElement.querySelector('bip-menu-item');
    });

    it('should create', function() {
      expect(bipMenuItemEl).to.be.an.instanceOf(HTMLElement);
    });

    it("should propagate the 'icon' properties'value to its 'bip-menu-item-icon' element", function() {
      const bipMenuItemIconDe = fixture.debugElement.query(By.css('bip-menu-item-icon'));

      // Please not that these are not the DOM attributes, but the component instance's attributes.
      const expectedAttributes = [
        { name: 'iconName', value: 'repeat' },
        { name: 'color', value: 'grey' },
        { name: 'backgroundColor', value: 'grass' }
      ];

      expectedAttributes.forEach(expectedAttribute => {
        const errorMessage = `The 'bip-menu-item-icon' element either does not have a '${expectedAttribute.name}' attribute, or its value is incorrect.`;
        expect(bipMenuItemIconDe.componentInstance[ expectedAttribute.name ], errorMessage).to.equal(expectedAttribute.value);
      });
    });

    it("should display the transcluded content in a 'span' element", function() {
      const spanEl = bipMenuItemEl.querySelector('span');
      expect(spanEl).to.be.an.instanceOf(HTMLElement);
      // trim() added to remove unwanted space around the text.
      expect(spanEl.innerText.trim()).to.equal(component.label.trim());
    });
  });
});
