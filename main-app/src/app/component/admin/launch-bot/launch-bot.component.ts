import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {BotService, LaunchBot} from '../../../service/bot.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'app-launch-bot',
  templateUrl: './launch-bot.component.html',
  styleUrls: ['./launch-bot.component.css']
})
export class LaunchBotComponent extends BaseBotComponent implements OnInit, OnDestroy {
  botServiceSubscription: Subscription;
  launchDTO: any;
  botAccessUrl: string;
  createButtonLabel = 'NONE';
  context = 'startLaunch';
  botCallSub: Subscription;
  trainedModelSelectValue;

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
    this.botServiceSubscription = this.botService.startLaunchBot(id).subscribe((model) => {
      this.launchDTO = model;
      if (this.launchDTO.bot.configurations.length > 0) {
        this.botAccessUrl = this.launchDTO.bot.configurations[0].url;
      }
      if (this.launchDTO.bot.status.code === 'LAUNCHED') {
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
    this.botCallSub = this.botService.stopBot(this.launchDTO.bot.id).subscribe(botRes => {
      this.launchDTO.bot = botRes;
      this.context = 'startLaunch';
      this.notificationService.notify('Refresh Bot Results',
        BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS);
    });
  }

  launchNow() {
    if (this.trainedModelSelectValue !== 'NONE') {
      const launchBot: LaunchBot = new LaunchBot(this.launchDTO.bot, +this.trainedModelSelectValue);
      this.botCallSub = this.botService.launchBot(launchBot).subscribe(botRes => {
        this.launchDTO.bot = botRes.bot;
        this.botAccessUrl = botRes.url1;
        this.context = 'launched';
        this.notificationService.notify('Refresh Bot Results',
          BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
          BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS);
        this.trainedModelSelectValue = 'NONE';
      });
    }
  }

  isDisabled() {
    return !this.trainedModelSelectValue || this.trainedModelSelectValue === 'NONE';
  }

  cancel() {
    this.context = null;
    this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
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
