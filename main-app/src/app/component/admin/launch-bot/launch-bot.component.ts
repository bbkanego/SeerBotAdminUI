import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {CustomValidator, Option} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {BotService} from '../../../service/bot.service';
import {BaseBotComponent} from '../../common/baseBot.component';


@Component({
  selector: 'seeradmin-launch-bot',
  templateUrl: './launch-bot.component.html',
  styleUrls: ['./launch-bot.component.css']
})
export class LaunchBotComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  botServiceSubscription: Subscription;
  launchDTO: any;
  botAccessUrl: string;
  createButtonLabel = 'NONE';
  context = 'startLaunch';
  botCallSub: Subscription;
  trainedModelSelectValue;
  launchForm: FormGroup;
  validationRules: any;
  trainedModels: Option[] = [];
  validationRuleSubscription: Subscription;

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private botService: BotService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.loadBot();
    });
  }

  onSelectHandler(event) {
    const value = event.target.value;
    console.log('selected value = ' + value);
    // this.launchForm.get('trainedModelId').setValue(value);
  }

  loadBot() {
    this.context = 'startLaunch';
    this.createButtonLabel = this.commonService.cmsContent[
      'launchBot'
      ].startLaunch.launchNowButton;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateLaunchBotRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.botServiceSubscription = this.botService
          .startLaunchBot(id)
          .subscribe(model => {
            this.launchDTO = model;
            if (this.launchDTO.bot.configurations.length > 0) {
              this.botAccessUrl = this.launchDTO.bot.configurations[0].url;
            }
            if (this.launchDTO.bot.status.code === 'LAUNCHED') {
              this.context = 'launched';
            } else {
              this.createForm();
            }
          });
      });
  }

  ngOnDestroy(): void {
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
    if (this.botCallSub) {
      this.botCallSub.unsubscribe();
    }
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
  }

  stopNow() {
    this.botCallSub = this.botService
      .stopBot(this.launchDTO.bot.id)
      .subscribe(botRes => {
        this.launchDTO.bot = botRes;
        this.context = 'startLaunch';
        this.notificationService.notify(
          'Refresh Bot Results',
          BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
          BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS
        );
      });
  }

  restartNow() {
    this.botCallSub = this.botService
      .restartBot(this.launchDTO.bot.id)
      .subscribe(botRes => {
        this.launchDTO.bot = botRes;
        this.context = 'startLaunch';
        this.notificationService.notify(
          'Refresh Bot Results',
          BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
          BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS
        );
      });
  }

  testNow() {
    if (this.trainedModelSelectValue !== 'NONE') {
      const launchBot = this.launchForm.value;
      this.botCallSub = this.botService
        .testBot(launchBot)
        .subscribe(botRes => {
          this.launchDTO.bot = botRes.bot;
          this.botAccessUrl = botRes.url1;
          this.context = 'test';
          this.router.navigate(['/admin/test_start', botRes.bot.id], {relativeTo: this.activatedRoute});
          this.trainedModelSelectValue = 'NONE';
        });
    }
  }

  launchNow() {
    if (this.launchForm.valid) {
      const launchBot = this.launchForm.value;
      this.botCallSub = this.botService
        .launchBot(launchBot)
        .subscribe(botRes => {
          this.launchDTO.bot = botRes.bot;
          this.botAccessUrl = botRes.url1;
          this.context = 'launched';
          this.notificationService.notify(
            'Refresh Bot Results',
            BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS
          );
          this.trainedModelSelectValue = 'NONE';
        });
    }
  }

  isDisabled() {
    return !this.launchForm.valid;
  }

  cancel() {
    this.context = null;
    this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
  }

  getPageHeader() {
    const statusCode = this.launchDTO.bot.status.code;
    if (statusCode === 'DRAFT') {
      return this.commonService.cmsContent['launchBot'].startLaunch.pageHeading;
    } else if (statusCode === 'TESTING') {
      return this.commonService.cmsContent['launchBot'].test.pageHeading;
    }
    return this.commonService.cmsContent['launchBot'].launched.pageHeading;
  }

  getCancelButtonLabel() {
    const statusCode = this.launchDTO.bot.status.code;
    if (statusCode === 'LAUNCHED') {
      return this.commonService.cmsContent['commonMessages'].okButton;
    } else if (statusCode === 'TESTING') {
      return this.commonService.cmsContent['commonMessages'].okButton;
    }
    return this.commonService.cmsContent['commonMessages'].cancelButton;
  }

  getHeader() {
    const statusCode = this.launchDTO.bot.status.code;
    if (statusCode === 'DRAFT') {
      return this.commonService.cmsContent['launchBot'].startLaunch.testBotMessage;
    } else if (statusCode === 'TESTING') {
      return this.commonService.cmsContent['launchBot'].test.botLaunchedForTesting;
    }
    return this.commonService.cmsContent['launchBot'].launched.botLaunchedMessage;
  }

  getResourceLocal(key: string) {
    return this.getResource('launchBot', key);
  }

  private createForm(): void {
    this.launchForm = this.autoGenFormGroup(
      this.launchDTO,
      this.validationRules
    );

    this.trainedModels = [];
    this.trainedModels.push(new Option('_NONE_', 'None'));
    for (const entry of this.launchDTO.referenceData.trainedModels) {
      this.trainedModels.push(new Option(entry.id, entry.name));
    }

    this.launchForm.get('trainedModelId').setValidators(CustomValidator.isSelectValid());
  }
}
