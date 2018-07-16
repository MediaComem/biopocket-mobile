// Mocha global variables (for Windows)
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule, NavController } from 'ionic-angular';
import { spy, stub } from 'sinon';

import { ENV as MockEnv } from '@app/environments/environment.test';
import { fr } from '@app/locales';
import Action from '@models/action';
import { ActionsListPage } from '@pages/actions-list/actions-list';
import ActionsModule from '@providers/actions-service/actions-module';
import ActionsService from '@providers/actions-service/actions-service';
import paginatedResponseMock from '@providers/actions-service/pagination-response.mock';
import EnvService from '@providers/env-service/env-service';
import { expect } from '@spec/chai';
import { resetStub } from '@spec/sinon';
// import { Deferred } from '@spec/utils';
import { translateModuleForRoot } from '@utils/i18n';
import { observableOf } from '@utils/observable';

type ActionsServiceMock = Partial<ActionsService>;

describe('ActionsListPage', function () {
  let component, fixture;
  let httpTestingCtrl: HttpTestingController;
  let navControllerMock;
  let actionsServiceMock: ActionsServiceMock;
  let infiniteScrollMock;
  let loadMoareActionsSpy;

  beforeEach(function () {

    infiniteScrollMock = {
      complete: spy(),
      enable: spy()
    };

    actionsServiceMock = {
      fetchPaginatedActions: stub().returns(observableOf([]))
    };

    navControllerMock = {};

    TestBed.configureTestingModule({
      declarations: [
        ActionsListPage
      ],
      imports: [
        HttpClientTestingModule,
        IonicModule.forRoot(ActionsListPage),
        translateModuleForRoot,
        ActionsModule
      ],
      providers: [
        { provide: NavController, useValue: navControllerMock },
        { provide: EnvService, useValue: MockEnv },
        { provide: ActionsService, useValue: actionsServiceMock }
      ]
    });

    const translateService = TestBed.get(TranslateService);
    translateService.setTranslation('fr', fr);
    translateService.use('fr');

    fixture = TestBed.createComponent(ActionsListPage);
    component = fixture.componentInstance;

    loadMoareActionsSpy = spy(component, 'loadMoreActions');

    httpTestingCtrl = TestBed.get(HttpTestingController);
  });

  afterEach(function () {
    // Make sure no HTTP requests were made during these tests (services should be mocked).
    httpTestingCtrl.verify();
  });

  it('should be created', function () {
    expect(component).to.be.an.instanceOf(ActionsListPage);
  });

  it('should load actions when loaded into view', function () {

    resetStub(actionsServiceMock.fetchPaginatedActions).returns(observableOf(paginatedResponseMock()));

    expect(component.actions).to.be.an('array');
    expect(component.actions).to.have.length(0);

    component.ionViewDidLoad();

    expect(loadMoareActionsSpy).to.have.callCount(1);

    expect(component.actions).to.have.length(3);
    component.actions.forEach(action => {
      expect(action).to.be.an.instanceOf(Action);
    });
  });

  it('should load more actions when scrolled', function() {
    resetStub(actionsServiceMock.fetchPaginatedActions).returns(observableOf(paginatedResponseMock()));
    component.ionViewDidLoad();

    component.loadMoreActions(infiniteScrollMock);
    expect(loadMoareActionsSpy).to.have.callCount(2);
    expect(infiniteScrollMock.complete).to.have.callCount(1);

    expect(component.actions).to.have.length(6);
    component.actions.forEach(action => {
      expect(action).to.be.an.instanceOf(Action);
    });
  });

  it('should not disable the infinite scroll when some actions remains to be loaded', function() {
    resetStub(actionsServiceMock.fetchPaginatedActions).returns(observableOf(paginatedResponseMock({
      offset: 0,
      limit: 3,
      total: 6,
      filteredTotal: 12
    })));

    component.loadMoreActions(infiniteScrollMock);

    expect(infiniteScrollMock.complete).to.have.callCount(1);
    expect(infiniteScrollMock.enable).to.have.been.calledWith(true);
  });

  it('should disable the infinite scroll when all actions have been loaded', function() {
    resetStub(actionsServiceMock.fetchPaginatedActions).returns(observableOf(paginatedResponseMock()));

    component.loadMoreActions(infiniteScrollMock);

    expect(infiniteScrollMock.complete).to.have.callCount(1);
    expect(infiniteScrollMock.enable).to.have.been.calledWith(false);
  });

});
