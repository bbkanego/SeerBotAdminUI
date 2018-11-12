import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgModel } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BaseReactiveComponent, SUBSCRIBER_TYPES } from 'my-component-library';

import { BotService } from '../../../service/bot.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-maintain-bot',
  templateUrl: './maintain-bot.component.html',
  styleUrls: ['./maintain-bot.component.css']
})
export class MaintainBotComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  botForm: FormGroup;
  private botModel;
  private validationRules;

  @ViewChild('formDir') formObj: NgModel;
  createButtonLabel = 'Create Bot';
  validationRuleSubscription: Subscription;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute,
    private botService: BotService) {
    super(injector);
  }

  private createForm(): void {
    this.botForm = this.autoGenFormGroup(
      this.botModel,
      this.validationRules
    );
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add-bot') > -1) {
        this.validationRuleSubscription = this.validationService
        .getValidationRuleMetadata('validateBotRule').subscribe(rules => {
          this.validationRules = rules;
          this.botService.initModelByType('chat_bot').subscribe((model) => {
            this.botModel = model;
            this.initComponent(path);
          });
        });
        this.enableBackButton();
      }
    });
  }

  private initComponent(path: string): void {
    this.createForm();
  }

  ngOnDestroy(): void {
  }

  onSubmit(eventObj) {

  }

  revert() {
    if (this.botModel) {
      this.createForm();
      this.notificationService.notifyAny(this.botForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET, 
                SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }
}
