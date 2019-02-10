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
  notificationSub: Subscription;
  searchContext = 'search_bots';
  cmsContent = {};

  constructor(private botService: BotService, private router: Router, private commonService: CommonService,
    private activatedRoute: ActivatedRoute, private notificationService: NotificationService) { }

  ngOnInit() {
    this.cmsContent = this.commonService.cmsContent;
    const searchBotCriteriaModel = this.botService.getSearchBotCriteriaModel();
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('search_bots_to_launch') > -1) {
        this.searchContext = 'search_bots_to_launch';
      } else if (path.indexOf('search_bots') > -1) {
        this.searchContext = 'search_bots';
      }
      this.searchBots(searchBotCriteriaModel);
    });

    this.notificationSub = this.notificationService.onNotification().subscribe((data: any) => {
      if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS) {
        this.searchBots(searchBotCriteriaModel);
      }
    });
  }

  private searchBots(model) {
    this.getAllSubscription = this.botService.searchBot(model).subscribe(results => {
      this.botResults = results;
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
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  editBot(id) {
    let finalPath = '';
    if (this.botService.getSearchContext() === 'editBot') {
      finalPath = 'edit';
    } else if (this.botService.getSearchContext() === 'launchBot') {
      finalPath = 'launch_start';
    } else if (this.botService.getSearchContext() === 'testBot') {
      finalPath = 'test_start';
    }
    this.router.navigate([finalPath, id], { relativeTo: this.activatedRoute });
  }

  getHeading(): string {
    if (this.botService.getSearchContext() === 'editBot') {
      return this.cmsContent.searchBots.pageHeading;
    } else if (this.botService.getSearchContext() === 'launchBot') {
      return this.cmsContent.searchBots.pageHeadingLaunchBot;
    } else if (this.botService.getSearchContext() === 'testBot') {
      return this.cmsContent.searchBots.pageHeadingTestBot;
    }
  }
}
