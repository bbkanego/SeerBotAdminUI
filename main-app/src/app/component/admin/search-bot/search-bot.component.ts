import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {BotService} from '../../../service/bot.service';
import {BaseBotComponent} from '../../common/baseBot.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-search-bot',
  templateUrl: './search-bot.component.html',
  styleUrls: ['./search-bot.component.css']
})
export class SearchBotComponent extends BaseBotComponent implements OnInit, OnDestroy {
  botResults$: Observable<any[]>;
  notificationSub: Subscription;
  searchContext = 'search_bots';
  cmsContent = {};

  constructor(
    private botService: BotService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    injector: Injector
  ) {
    super(injector);
  }

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

    this.notificationSub = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
        if (
          data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS
        ) {
          this.searchBots(searchBotCriteriaModel);
        }
      });
  }

  private searchBots(model) {

    if (!model) {
      model = this.botService.getSessionStorageItem('searchBotModel');
      this.botService.setActionContext(this.botService.getSessionStorageItem('actionCtx'));
    } else {
      this.botService.setSessionStorageItem('searchBotModel', model);
      this.botService.setSessionStorageItem('actionCtx', this.botService.getActionContext());
    }

    this.botResults$ = this.botService.searchBot(model);
  }

  private getAllResults() {
    this.botResults$ = this.botService.getAll();
  }

  ngOnDestroy(): void {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  editBot(id) {
    let finalPath = '';
    if (this.botService.getActionContext() === 'editBot') {
      finalPath = 'edit';
    } else if (this.botService.getActionContext() === 'launchBot') {
      finalPath = 'launch_start';
    } else if (this.botService.getActionContext() === 'testBot') {
      finalPath = 'test_start';
    }
    this.router.navigate([finalPath, id], {relativeTo: this.activatedRoute});
  }

  getHeading(): string {
    const localCmsContent = this.cmsContent['searchBots'];
    if (this.botService.getActionContext() === 'editBot') {
      return localCmsContent.pageHeading;
    } else if (this.botService.getActionContext() === 'launchBot') {
      return localCmsContent.pageHeadingLaunchBot;
    } else if (this.botService.getActionContext() === 'testBot') {
      return localCmsContent.pageHeadingTestBot;
    }
  }

  getResourceLocal(key: string): string {
    return this.getResource('searchBots', key);
  }
}
