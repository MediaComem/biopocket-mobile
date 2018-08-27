import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BipActionCardComponent } from '@components/bip-action-card/bip-action-card';
import Action from '@models/action';
import { expect } from '@spec/chai';

describe('BipActionCardComponent', function() {

  let fixture: ComponentFixture<BipActionCardComponent>;
  let component: BipActionCardComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ BipActionCardComponent ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BipActionCardComponent);
    component = fixture.componentInstance;
  });

  it("should throw an error when no 'action' value is provided", function() {
    expect(() => fixture.detectChanges()).to.throw(Error, "A 'bip-action-card' tag requires an Action as it's 'action' attribute value.");
  });

  describe("with an 'action' value", () => {

    beforeEach(() => {
      component.action = new Action({
        id: '5a6752c0-6d16-4dde-9b6c-df813a30a5e7',
        themeId: '19cf3b0a-7c4c-410d-8c5c-5c2697479014',
        theme: {
          id: '19cf3b0a-7c4c-410d-8c5c-5c2697479014',
          title: 'Heasil ovasa zereru.',
          description: 'Jevo difuhnog ega bosasah iw weped reppoced sas migret lihku zav pulig luodu vabagor higaene fam. Ne lazdo juvup ime he zep di rerusluc kojoju ru kalub arda mopsat. Sit retubfeb ugru pezobur busokze rece jok ilhar vad wum zoc mizham. Bonlojraj afiju vap tik jepigelef guckimca gej de jivsi huvikre roljobpow fempeewi osaamseh. Vohso fol ralridpo jagton luvud ul kozagiv va dilakido aru uvulaob gel dep lu mohaja reegu. Co uwairobi dolo uzoginod wijopiru annuva oleipniw dirov nek av up nurar aklocen ivciw luzdene ew. Huwdi en niva pice vazca fo vefiman nupsi he tava oce bograjzi ce irhu wigu lahsu rujis van.',
          photoUrl: 'http://example.com/sumpifum.jpg',
          source: 'Wow ne segestuj.',
          createdAt: '2018-08-28T08:53:25.397Z',
          updatedAt: '2018-08-28T08:53:25.397Z'
        },
        title: 'Akcu tevzoet ekacore.',
        description: 'Jinnesi nijmoh hoza jecebov ki tep unagu jegi wazu teozume suf hazmaf.',
        createdAt: '2018-08-28T10:54:14.088Z',
        updatedAt: '2018-08-28T10:54:14.088Z'
      });
      fixture.detectChanges();
    });

    it('should create', function() {
      expect(component).to.be.an.instanceOf(BipActionCardComponent);
    });
  });
});