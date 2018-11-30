import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { BotService } from '../../../service/bot.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-launch-bot',
  templateUrl: './launch-bot.component.html',
  styleUrls: ['./launch-bot.component.css']
})
export class LaunchBotComponent extends BaseBotComponent implements OnInit, OnDestroy {
  validationRuleSubscription: Subscription;
  validationRules: any;
  botServiceSubscription: Subscription;
  botModel: any;
  botAccessUrl: string;
  createButtonLabel = 'NONE';
  context = 'startLaunch';
  botCallSub: Subscription;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute, private router: Router, private botService: BotService) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.loadBot();
    });
  }

  loadBot() {
    this.context = 'startLaunch';
    this.createButtonLabel = this.commonService.cmsContent['launchBot'].startLaunch.launchNowButton;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.botServiceSubscription = this.botService.getById(id).subscribe((model) => {
      this.botModel = model;
      if (model.configurations.length > 0) {
        this.botAccessUrl = model.configurations[0].url;
      }
      if (this.botModel.status.code === 'LAUNCHED') {
        this.context = 'launched';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
    if (this.botCallSub) {
      this.botCallSub.unsubscribe();
    }
  }

  stopNow() {
    this.botCallSub = this.botService.stopBot(this.botModel.id).subscribe(botRes => {
      this.botModel = botRes;
      this.context = 'startLaunch';
      this.notificationService.notify('Refresh Bot Results',
        BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS);
    });
  }

  launchNow() {
    this.botCallSub = this.botService.launchBot(this.botModel.id).subscribe(botRes => {
      this.botModel = botRes.bot;
      this.botAccessUrl = botRes.url1;
      this.context = 'launched';
      this.notificationService.notify('Refresh Bot Results',
        BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS);
    });
  }

  cancel() {
    this.context = null;
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
  }

  getPageHeader() {
    if (this.context === 'launched') {
      return this.commonService.cmsContent['launchBot'].launched.pageHeading;
    }
    return this.commonService.cmsContent['launchBot'].startLaunch.pageHeading;
  }

  getCancelButtonLabel() {
    if (this.context === 'launched') {
      return this.commonService.cmsContent['commonMessages'].okButton;
    }
    return this.commonService.cmsContent['commonMessages'].cancelButton;
  }

  getHeader() {
    if (this.context === 'launched') {
      return this.commonService.cmsContent['launchBot'].launched.message;
    }
    return this.commonService.cmsContent['launchBot'].startLaunch.message;
  }

}
