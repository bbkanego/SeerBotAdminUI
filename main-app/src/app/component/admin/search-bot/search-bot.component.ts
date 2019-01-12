import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CommonService, NotificationService } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { BotService } from '../../../service/bot.service';

@Component({
  selector: 'app-search-bot',
  templateUrl: './search-bot.component.html',
  styleUrls: ['./search-bot.component.css']
})
export class SearchBotComponent implements OnInit, OnDestroy {

  botResults;
  getAllSubscription: Subscription;
  searchContext = 'search_bots';

  constructor(private botService: BotService, private router: Router, private commonService: CommonService,
    private activatedRoute: ActivatedRoute, private notificationService: NotificationService) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('search_bots_to_launch') > -1) {
        this.searchContext = 'search_bots_to_launch';
      } else if (path.indexOf('search_bots') > -1) {
        this.searchContext = 'search_bots';
      }
      this.getAllResults();
    });

    this.notificationService.onNotification().subscribe((data: any) => {
      if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS) {
        this.getAllResults();
      }
    });
  }

  private getAllResults() {
    this.getAllSubscription = this.botService.getAll().subscribe(results => {
      this.botResults = results;
    });
  }

  ngOnDestroy(): void {
    if (this.getAllSubscription) {
      this.getAllSubscription.unsubscribe();
    }
  }

  editBot(id) {
    let finalPath = '';
    if (this.searchContext === 'search_bots') {
      finalPath = 'edit';
    } else if (this.searchContext === 'search_bots_to_launch') {
      finalPath = 'launch_start';
    }
    this.router.navigate([finalPath, id], { relativeTo: this.activatedRoute });
  }
}
