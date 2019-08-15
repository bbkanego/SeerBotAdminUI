import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { IntentService } from '../../../service/intent.service';
import { BaseBotComponent } from '../../common/baseBot.component';


@Component({
  selector: 'app-search-intent',
  templateUrl: './search-intent.component.html',
  styleUrls: ['./search-intent.component.css']
})
export class SearchIntentComponent extends BaseBotComponent implements OnInit, OnDestroy {
  intentsResults;
  allIntents: Subscription;
  cmsContent = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private intentService: IntentService,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.cmsContent = this.commonService.cmsContent;
    const searchModel = this.intentService.getIntentSearchModel();
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.searchIntents(searchModel);
    });

    this.notificationService.onNotification().subscribe((data: any) => {
      if (
        data.subscriberType ===
        BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS
      ) {
        this.router.navigate(['/admin/search_intent']);
      }
    });
  }

  private searchIntents(model) {
    this.allIntents = this.intentService
      .searchIntents(model)
      .subscribe(results => {
        this.intentsResults = results;
        this.intentService.setAllIntents(this.intentsResults);
      });
  }

  ngOnDestroy(): void {
    if (this.allIntents) {
      this.allIntents.unsubscribe();
    }
  }

  editIntent(id: string) {
    this.router.navigate(['edit', id], {
      queryParams: {action: this.intentService.getActionContext()},
      relativeTo: this.activatedRoute
    });
  }

  getHeading(): string {
    const localCms = this.cmsContent['searchIntents'];
    if (this.intentService.getActionContext() === 'predefined') {
      return localCms.pageHeadingPredefined;
    } else {
      return localCms.pageHeadingCustom;
    }
  }

  getResourceLocal(key: string): string {
    return this.getResource('searchIntents', key);
  }
}
