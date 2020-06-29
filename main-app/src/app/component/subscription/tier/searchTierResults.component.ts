import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {SubscriptionService} from '../../../service/subscription.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'seeradmin-search-tier',
  templateUrl: './searchTierResults.component.html',
  styleUrls: ['./searchTierResults.component.css']
})
export class SearchTierResultsComponent extends BaseBotComponent implements OnInit, OnDestroy {
  tierResults: any[];
  searchTierSubscription: Subscription;
  notificationSub: Subscription;
  searchContext = 'searchTier';

  constructor(
    private subscriptionService: SubscriptionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    const searchCriteriaModel = this.subscriptionService.getSearchCriteriaModel();
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.searchTiers(searchCriteriaModel);
    });

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_TIER_SEARCH_RESULTS) {
          this.searchTiers(searchCriteriaModel);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.searchTierSubscription) {
      this.searchTierSubscription.unsubscribe();
    }
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  editCategory(id: string) {
    this.router.navigate(['ref-data', id], {relativeTo: this.activatedRoute});
  }

  getResourceLocal(key: string): string {
    return this.getResource('subscription', 'tier.' + key);
  }

  editTier(id: string) {
    this.router.navigate(['edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  private searchTiers(model) {
    this.searchTierSubscription = this.subscriptionService
      .searchTiers()
      .subscribe(results => {
        this.tierResults = results;
      });
  }

  private getAllResults() {
    this.searchTierSubscription = this.subscriptionService.getAll().subscribe(results => {
      this.tierResults = results;
    });
  }
}
