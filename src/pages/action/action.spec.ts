import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController, NavParams } from 'ionic-angular';
import { stub } from 'sinon';

import { fr } from '@app/locales';
import Action from '@models/action';
import { ActionPage } from '@pages/action/action';
import { mockActions as mockActionsData } from '@providers/actions-service/action-data.mock';
import ActionsService from '@providers/actions-service/actions-service';
import { expect } from '@spec/chai';
import { translateModuleForRoot } from '@utils/i18n';
import { observableOf } from '@utils/observable';

type ActionsServiceMock = Partial<ActionsService>;

describe('ActionPage', () => {
  let navControllerMock;
  let navParamsMock;
  let fixture: ComponentFixture<ActionPage>;
  let component: ActionPage;
  let httpTestingCtrl: HttpTestingController;
  let actionsServiceMock: ActionsServiceMock;
  let navParams;
  let mockAction: Action;

  beforeEach(() => {

    navParams = { title: 'An action', id: 'an-id' };
    mockAction = new Action(mockActionsData[0]);

    navControllerMock = {};
    navParamsMock = {
      get: stub().returns(navParams)
    };

    actionsServiceMock = {
      fetchAction: stub().returns(observableOf(mockAction))
    };

    TestBed.configureTestingModule({
      declarations: [
        ActionPage
      ],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot(ActionPage),
        translateModuleForRoot
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock },
        { provide: NavParams, useValue: navParamsMock },
        { provide: ActionsService, useValue: actionsServiceMock }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');

    fixture = TestBed.createComponent(ActionPage);
    component = fixture.componentInstance;

    httpTestingCtrl = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpTestingCtrl.verify());

  it('should be created', function() {
    expect(component).to.be.an.instanceOf(ActionPage);
  });

  it('should have an action property with the correct value', function() {
    expect(component.action.title).to.equals(navParams.title);
    expect(component.action.id).to.equals(navParams.id);
  });

  describe('#ionViewDidEnter', () => {

    it('should load the complete action', function() {
      expect(component.action).not.to.eqls(mockAction);
      component.ionViewDidEnter();
      expect(actionsServiceMock.fetchAction).to.have.been.calledWith('an-id');
      expect(component.action).to.eqls(mockAction);
    });

  });

});