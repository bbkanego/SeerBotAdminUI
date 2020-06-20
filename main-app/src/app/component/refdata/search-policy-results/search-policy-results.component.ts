import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {PolicyService} from '../../../service/policy.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'app-search-policy-results',
  templateUrl: './search-policy-results.component.html',
  styleUrls: ['./search-policy-results.component.css']
})
export class SearchPolicyResultsComponent extends BaseBotComponent
  implements OnInit, OnDestroy {

  policyResults: any[];
  searchCriteriaSubscription: Subscription;
  notificationSub: Subscription;
  searchContext = 'searchResults';

  constructor(
    private policyService: PolicyService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    const searchCriteriaModel = this.policyService.getSearchCriteriaModel();
    this.activatedRoute.url.subscribe(() => {
      this.searchPolicy(searchCriteriaModel);
    });

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_POLICY_SEARCH_RESULTS) {
          this.router.navigate(['/ref-data/policy/search']);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.searchCriteriaSubscription) {
      this.searchCriteriaSubscription.unsubscribe();
    }
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  editPolicy(id: string) {
    this.router.navigate(['edit', id], {relativeTo: this.activatedRoute});
  }

  getResourceLocal(key: string): string {
    return this.getResource('refData', key);
  }

  private searchPolicy(model) {
    this.searchCriteriaSubscription = this.policyService
      .getAll().subscribe(results => {
        this.policyResults = results;
      });
  }
}
