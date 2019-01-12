import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment, Router, Route } from '@angular/router';
import { NotificationService, CommonService } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { IntentService } from '../../../service/intent.service';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';

@Component({
  selector: 'app-search-intent',
  templateUrl: './search-intent.component.html',
  styleUrls: ['./search-intent.component.css']
})
export class SearchIntentComponent implements OnInit, OnDestroy {

  intentsResults;
  allIntents: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private intentService: IntentService,
    private notificationService: NotificationService, private commonService: CommonService,
    private router: Router) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.getAllResults();
    });

    this.notificationService.onNotification().subscribe((data: any) => {
      if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS) {
        this.getAllResults();
      }
    });
  }

  private getAllResults() {
    this.allIntents = this.intentService.getAll().subscribe(results => {
      this.intentsResults = results;
      this.intentService.setAllIntents(this.intentsResults);
    });
  }

  ngOnDestroy(): void {
    if (this.allIntents) {
      this.allIntents.unsubscribe();
    }
  }

  editIntent(id) {
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }

}
