import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BaseReactiveComponent, Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { BotService } from '../../../service/bot.service';

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

  category: Option[] = [];

  constructor(injector: Injector, private activatedRoute: ActivatedRoute,
    private botService: BotService, private router: Router) {
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

    this.category.push(new Option('', 'None'));
    for (const entry of this.botModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }
  }

  ngOnDestroy(): void {
  }

  onSubmit(eventObj) {
    if (this.botForm.invalid) {

    } else {
      const selectedCat = this.botForm.get('category').value;
      const targetCat = this.botModel.referenceData.categories.filter(element => element.code === selectedCat);
      this.botForm.get('category').setValue(targetCat[0]);
      const enLang = this.botModel.referenceData.languages.filter(element => element.code === 'en');
      const finalModel = this.botForm.value;
      finalModel.supportedLanguages.push(enLang[0]);
      this.botService.save(finalModel).subscribe(res => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  revert() {
    if (this.botModel) {
      this.createForm();
      this.notificationService.notifyAny(this.botForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET, 
                SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }
}
