import { Component } from '@angular/core';
import { InfiniteScroll, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';

import { Action } from '@models/action';
import { ActionPage } from '@pages/action/action';
import { Print } from '@print';
import { ActionsService } from '@providers/actions-service/actions-service';

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[ActionsListPage]';

@Component({
  selector: 'actions-list-page',
  templateUrl: 'actions-list.html'
})
export class ActionsListPage {

  actions: Action[];
  fetchActionObs: Observable<Action[]>;
  actionPage: any;

  constructor(
    public navCtrl: NavController,
    private readonly actionsService: ActionsService
  ) {
    this.actions = [];
    this.fetchActionObs = null;
    this.actionPage = ActionPage;
  }

  ionViewDidLoad(): void {
    this.loadMoreActions();
  }

  loadMoreActions(infiniteScroll?: InfiniteScroll) {
    const fetchParams = {
      offset: String(this.actions.length),
      include: 'theme'
    };
    // TODO: handle fetch paginated actions error
    this.actionsService.fetchPaginatedActions(fetchParams)
      .subscribe(response => {
        Print.debug(LOG_REF, response.data);
        this.actions = this.actions.concat(response.data);
        if (infiniteScroll) {
          infiniteScroll.complete();
          infiniteScroll.enable(response.hasMore());
        }
      });
  }

}
