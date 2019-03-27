import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';

import { expect } from '@spec/chai';
import { InputStateIndicatorComponent } from './input-state-indicator';

export function inputStateIndicatorComponentTests() {
  describe('InputStateIndicatorComponent', () => {
    let fixture: ComponentFixture<InputStateIndicatorComponent>;
    let component: InputStateIndicatorComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [
          InputStateIndicatorComponent
        ],
        imports: [
          IonicModule.forRoot(InputStateIndicatorComponent)
        ]
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(InputStateIndicatorComponent);
      component = fixture.componentInstance;
    });

    it("should throw an error when no 'input' value is provided", function() {
      expect(() => fixture.detectChanges()).to.throw(Error, "An 'input-state-indicator' tag requires a value for its 'input' attribute.");
    });

    describe("with an 'input' value", () => {

      it('should compile and display nothing if the input is invalid without any user interaction', function() {
        component.inputModel = {};
        fixture.detectChanges();

        expect(component).to.be.an.instanceOf(InputStateIndicatorComponent);

        const ionIconDe = fixture.debugElement.query(By.css('ion-icon'));
        expect(ionIconDe).to.equal(null);
      });

      it('should compile and display a checkmark if the input is valid', function() {
        component.inputModel = {
          valid: true
        };
        fixture.detectChanges();

        expectIonIcon('checkmark-circle');
      });
      it('should compile and display a crossmark if the input is invalid after the user interacted with it', function() {
        component.inputModel = {
          invalid: true,
          touched: true
        };
        fixture.detectChanges();
        expectIonIcon('close-circle');

        component.inputModel = {
          invalid: true,
          dirty: true
        };
        fixture.detectChanges();
        expectIonIcon('close-circle');
      });
    });

    /**
     * Tests that the component's markup contains only one `ion-icon` element which `name` attribute equals the provided name.
     * @param name The value of the `ion-icon`'s `name` attribute.
     */
    function expectIonIcon(name) {
      const ionIconDe = fixture.debugElement.queryAll(By.css('ion-icon'));
      expect(ionIconDe).to.have.lengthOf(1);
      expect(ionIconDe[ 0 ].nativeElement.getAttribute('name')).to.equals(name);
    }
  });
}