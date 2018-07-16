import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BipIconStub as BipIconComponent } from '@components/bip-icon/bip-icon.stub';
import { BipProfilePictureComponent } from '@components/bip-profile-picture/bip-profile-picture';
import { expect } from '@spec/chai';


describe('BipProfilePicture', () => {

  let fixture: ComponentFixture<BipProfilePictureComponent>;
  let component: BipProfilePictureComponent;
  let componentEl: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ BipProfilePictureComponent, BipIconComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BipProfilePictureComponent);
    component = fixture.componentInstance;
    componentEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('shoould create', function() {
    expect(component).to.be.an.instanceOf(BipProfilePictureComponent);
  });

  describe("without a 'src' value", () => {
    it("should have a 'bip-icon' element", function() {
      const bipIconEl = componentEl.querySelector('bip-icon');
      expect(bipIconEl).to.be.an.instanceOf(HTMLElement);
    });

    it("should not have an 'img' element", function() {
      const imageEl = componentEl.querySelector('img');
      expect(imageEl).to.equal(null);
    });
  });

  describe("with a 'src' value", () => {

    beforeEach(() => {
      component.src = 'http://example.com/picture.png';
      fixture.detectChanges();
    });

    it("should not have a 'bip-icon' element", function() {
      const bipIconEl = componentEl.querySelector('bip-icon');
      expect(bipIconEl).to.equal(null);
    });

    it("should have an 'img' element with the correct 'src'", function() {
      const imageEl = componentEl.querySelector('img');
      expect(imageEl).to.be.an.instanceOf(HTMLElement);
      expect(imageEl.getAttribute('src')).to.equal('http://example.com/picture.png');
    });
  });

});