import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BipIconStub as BipIconComponent } from '@components/bip-icon/bip-icon.stub';
import { BipMenuHeaderComponent } from '@components/bip-menu-header/bip-menu-header';
import { BipProfilePictureStub as BipProfilePictureComponent } from '@components/bip-profile-picture/bip-profile-picture.stub';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

describe('BipMenuHeader', () => {

  let fixture: ComponentFixture<BipMenuHeaderComponent>;
  let component: BipMenuHeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BipMenuHeaderComponent, BipProfilePictureComponent, BipIconComponent ],
      imports: [ translateModuleForRoot ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BipMenuHeaderComponent);
    component = fixture.componentInstance;
  });

  it("should raise an error if no 'user' value is provided", function() {
    expect(() => fixture.detectChanges()).to.throw(Error, "A 'bip-menu-header' component requires a value for its 'user' attribute.");
  });

  describe("with a 'user' value", function() {

    beforeEach(() => {
      component.user = {
        profilePictureUrl: 'http://example.com/picture.png',
        completeName: 'Test User'
      };
      fixture.detectChanges();
    });

    it('should create', function() {
      expect(component).to.to.an.instanceOf(BipMenuHeaderComponent);
    });

    it('should display the correct profile picture', function() {
      const bipProfilePictureEl = fixture.debugElement.query(By.css('bip-profile-picture'));
      expect(bipProfilePictureEl).to.be.an.instanceOf(DebugElement);
      expect(bipProfilePictureEl.componentInstance.src).to.equal(component.user.profilePictureUrl);
    });

    it('should display the correct user name', function() {
      const usernameEl = fixture.nativeElement.querySelector('.username');
      expect(usernameEl).to.be.an.instanceOf(HTMLElement);
      expect(usernameEl.innerText).to.equal(component.user.completeName);
    });
  });
});
