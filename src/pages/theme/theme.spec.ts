import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { stub } from 'sinon';

import { fr } from '@app/locales';
import { Theme } from '@models/theme';
import { TranslateService } from '@ngx-translate/core';
import { ThemePage } from '@pages/theme/theme';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';

describe('ThemePage', () => {
  let navControllerMock, navParamsMock;
  let component: ThemePage;
  let fixture: ComponentFixture<ThemePage>;
  let navParams: Theme;

  beforeEach(() => {
    navParams = {
      id: '19cf3b0a-7c4c-410d-8c5c-5c2697479014',
      description: 'Jevo difuhnog ega bosasah iw weped reppoced sas migret lihku zav pulig luodu vabagor higaene fam. Ne lazdo juvup ime he zep di rerusluc kojoju ru kalub arda mopsat. Sit retubfeb ugru pezobur busokze rece jok ilhar vad wum zoc mizham. Bonlojraj afiju vap tik jepigelef guckimca gej de jivsi huvikre roljobpow fempeewi osaamseh. Vohso fol ralridpo jagton luvud ul kozagiv va dilakido aru uvulaob gel dep lu mohaja reegu. Co uwairobi dolo uzoginod wijopiru annuva oleipniw dirov nek av up nurar aklocen ivciw luzdene ew. Huwdi en niva pice vazca fo vefiman nupsi he tava oce bograjzi ce irhu wigu lahsu rujis van.',
      photoUrl: 'https://example.com/H7-main.jpg',
      title: 'Heasil ovasa zereru.',
      source: 'Wow ne segestuj.',
      createdAt: new Date('2018-08-28T08:53:25.397Z'),
      updatedAt: new Date('2018-08-28T08:53:25.397Z')
    };

    navControllerMock = {};

    navParamsMock = {
      get: stub().returns(navParams)
    };

    TestBed.configureTestingModule({
      declarations: [ ThemePage ],
      imports: [
        translateModuleForRoot,
        IonicModule.forRoot(ThemePage)
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock },
        { provide: NavParams, useValue: navParamsMock }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');

    fixture = TestBed.createComponent(ThemePage);
    component = fixture.componentInstance;
  });

  it('should be created', function() {
    expect(component).to.be.an.instanceOf(ThemePage);
  });

  it('should have a theme property with the correct values', function() {
    expect(component.theme).to.eqls(navParams);
  });
});
