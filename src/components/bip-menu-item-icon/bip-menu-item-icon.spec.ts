import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BipIconStub as BipIconComponent } from '@components/bip-icon/bip-icon.stub';
import { BipMenuItemIconComponent } from '@components/bip-menu-item-icon/bip-menu-item-icon';
import { expect } from '@spec/chai';

describe('BipMenuItemIconComponent', () => {
  let fixture: ComponentFixture<BipMenuItemIconComponent>;
  let component: BipMenuItemIconComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ BipMenuItemIconComponent, BipIconComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BipMenuItemIconComponent);
    component = fixture.componentInstance;
  });

  it("should throw an error if no 'name' value is provided", function() {
    expect(() => fixture.detectChanges()).to.throw(Error, "A 'bip-menu-item-icon' tag requires a value for its 'name' attribute.");
  });

  describe("with a 'name' value", () => {

    beforeEach(() => {
      component.iconName = 'calendar';
      fixture.autoDetectChanges();
    });

    it('should create correctly', function() {
      expect(component).to.be.an.instanceOf(BipMenuItemIconComponent);
      const bipIconDe = fixture.debugElement.query(By.css('bip-icon'));
      expect(bipIconDe.componentInstance.iconName).to.equal('calendar');
    });

    describe('with optionals attributes value', () => {

      it("should add the correct class based on the 'color' value", function() {
        component.color = 'warning';

        const componentEl = fixture.nativeElement;
        expect(componentEl.classList.contains('warning-color')).to.equal(true);
      });

      it("should add the correct class based on the 'bg-color' value", function() {
        component.backgroundColor = 'night';

        const componentEl = fixture.nativeElement;
        expect(componentEl.classList.contains('night-bg-color')).to.equal(true);
      });
    });
  });
});
