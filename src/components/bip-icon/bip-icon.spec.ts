import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BipIconComponent } from '@components/bip-icon/bip-icon';
import { expect } from '@spec/chai';

describe('BipIconComponent', () => {

  let fixture: ComponentFixture<BipIconComponent>;
  let component: BipIconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BipIconComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BipIconComponent);
    component = fixture.componentInstance;
  });

  it("should throw an error when no 'name' value is provided", function() {
    expect(() => fixture.detectChanges()).to.throw(Error, "A 'bip-icon' tag requires a value for its 'name' attribute.");
  });

  describe("with a 'name' value", () => {
    beforeEach(() => {
      component.iconName = 'hourglass';
      fixture.autoDetectChanges();
    });

    it('should create correctly', function() {
      expect(component).to.be.an.instanceOf(BipIconComponent);
    });

    it('should have the corresponding class and reference', function() {
      const componentEl: HTMLElement = fixture.nativeElement;

      // Check that the `svg` element has the appropriate class
      const svgEl = componentEl.querySelector('svg');
      expect(svgEl.classList.contains('bip-icon-hourglass')).to.equal(true);

      // Check that the `use` element references the correct SVG element.
      const useEl = svgEl.querySelector('use');
      expect(useEl.getAttribute('xlink:href')).to.equal('assets/icon/bip-icon-set.svg#bip-hourglass-svg');
    });

    describe("and a 'color' value", () => {

      it('should have the corresponding class', function() {
        component.color = 'river';
        expect(fixture.nativeElement.classList.contains('river-color')).to.equal(true);
      });
    });
  });
});
