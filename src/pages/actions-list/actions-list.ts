import { Component } from '@angular/core';
import { InfiniteScroll, NavController } from 'ionic-angular';
import { Observable } from 'rxjs';

import Action from '@models/action';
import ActionsService from '@providers/actions-service/actions-service';

// tslint:disable-next-line:no-unused no-unused-variable
const LOG_REF = '[ActionsListPage]';

@Component({
  selector: 'actions-list-page',
  templateUrl: 'actions-list.html'
})
export class ActionsListPage {

  actions: Action[];
  fetchActionObs: Observable<Action[]>;

  constructor(
    public navCtrl: NavController,
    private readonly actionsService: ActionsService
  ) {
    this.actions = [];
    this.fetchActionObs = null;
  }

  ionViewDidLoad(): void {
    this.loadMoreActions();
  }

  loadMoreActions(infiniteScroll?: InfiniteScroll) {
    const fetchParams = {
      offset: String(this.actions.length)
    };
    // TODO: handle fetch paginated actions error
    this.actionsService.fetchPaginatedActions(fetchParams)
      .subscribe(response => {
        this.actions = this.actions.concat(response.data);
        if (infiniteScroll) {
          infiniteScroll.complete();
          infiniteScroll.enable(response.hasMore());
        }
      });
  }

}
