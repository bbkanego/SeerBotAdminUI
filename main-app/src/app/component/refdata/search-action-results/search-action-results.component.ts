import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {ActionService} from '../../../service/action.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'seeradmin-search-action-results',
  templateUrl: './search-action-results.component.html',
  styleUrls: ['./search-action-results.component.css']
})
export class SearchActionResultsComponent extends BaseBotComponent implements OnInit, OnDestroy {

  actionResults: any[];
  searchResultsSubscription: Subscription;
  notificationSub: Subscription;
  searchContext = 'search_actions';

  constructor(
    private actionService: ActionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(() => {
      this.searchActions();
    });

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_ACTIONS_SEARCH_RESULTS
        ) {
          this.router.navigate(['/ref-data/action/search']);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe();
    }
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  editAction(id: string) {
    this.router.navigate(['edit', id], {relativeTo: this.activatedRoute});
  }

  getResourceLocal(key: string): string {
    return this.getResource('refData', key);
  }

  private searchActions() {
    this.searchResultsSubscription = this.actionService
      .getAll()
      .subscribe(results => {
        this.actionResults = results;
      });
  }
}
