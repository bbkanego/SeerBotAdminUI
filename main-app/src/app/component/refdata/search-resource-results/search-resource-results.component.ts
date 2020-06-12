import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { ResourceService } from '../../../service/resource.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-search-resource-results',
  templateUrl: './search-resource-results.component.html',
  styleUrls: ['./search-resource-results.component.css']
})
export class SearchResourceResultsComponent extends BaseBotComponent implements OnInit, OnDestroy {

  resourceResults: any[];
  searchCriteriaSubscription: Subscription;
  notificationSub: Subscription;
  searchContext = 'searchResources';

  constructor(
    private resourceService: ResourceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe(() => {
      this.searchResources();
    });

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (
          data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_RESOURCES_SEARCH_RESULTS
        ) {
          this.router.navigate(['/ref-data/resource/search']);
        }
      });
  }

  private searchResources() {
    this.searchCriteriaSubscription = this.resourceService
      .searchResource()
      .subscribe(results => {
        this.resourceResults = results;
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

  editResource(id: string) {
    this.router.navigate(['edit', id], {
      relativeTo: this.activatedRoute
    });
  }

  getResourceLocal(key: string): string {
    return this.getResource('refData', key);
  }

}
