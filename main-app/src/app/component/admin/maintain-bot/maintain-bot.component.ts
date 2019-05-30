import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgModel } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BaseReactiveComponent, Option, SUBSCRIBER_TYPES, CommonService } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { BotService } from '../../../service/bot.service';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-maintain-bot',
  templateUrl: './maintain-bot.component.html',
  styleUrls: ['./maintain-bot.component.css']
})
export class MaintainBotComponent extends BaseBotComponent implements OnInit, OnDestroy {

  botForm: FormGroup;
  private botModel;
  private validationRules;

  @ViewChild('formDir') formObj: NgModel;
  createButtonLabel = 'Create Bot';
  validationRuleSubscription: Subscription;

  category: Option[] = [];
  botServiceSubscription: Subscription;
  currentEditCategory: any;

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

  private initAddBot(path) {
    this.currentAction = 'add';
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateBotRule').subscribe(rules => {
        this.validationRules = rules;
        this.botServiceSubscription = this.botService.initModelByType('chat_bot').subscribe((model) => {
          this.botModel = model;
          this.initComponent(path);
        });
      });
  }

  private editBot() {
    this.currentAction = 'edit';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateBotRule').subscribe(rules => {
        this.validationRules = rules;
        this.botServiceSubscription = this.botService.getById(id).subscribe((model) => {
          this.botModel = model;
          this.initComponent('');
        });
      });
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add-bot') > -1) {
        this.initAddBot(path);
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.editBot();
      }
    });
  }

  private initComponent(path: string): void {
    if (this.currentAction === 'edit') {
      this.currentEditCategory = this.botModel.category;
      this.botModel.category = null;
      this.createForm();
      // need this when we reset the form!
      this.botModel.category = this.currentEditCategory;
    } else {
      this.createForm();
    }

    this.category = [];
    this.category.push(new Option('', 'None'));
    for (const entry of this.botModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }

    if (this.currentEditCategory != null) {
      this.botForm.get('category').setValue(this.currentEditCategory.code);
    }

    if (this.currentAction === 'edit') {
      this.notificationService.notifyAny(this.botForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }

  ngOnDestroy(): void {
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
  }

  onSubmit(eventObj) {
    this.markFormGroupTouched(this.botForm);

    if (this.botForm.invalid) { } else {
      const selectedCat = this.botForm.get('category').value;
      const targetCat = this.botModel.referenceData.categories.filter(element => element.code === selectedCat);
      this.botForm.get('category').setValue(targetCat[0]);
      const enLang = this.botModel.referenceData.languages.filter(element => element.code === 'en');
      const finalModel = this.botForm.value;
      finalModel.supportedLanguages.push(enLang[0]);
      this.botService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.botForm = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS);
        }
      });
    }
  }

  cancel() {
    if (this.currentAction === 'add') {
      this.router.navigate(['/dashboard']);
    } else {
      this.botForm = null;
    }
  }

  revert() {
    if (this.botModel) {
      this.createForm();
      this.notificationService.notifyAny(this.botForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }

  getResourceLocal(key) {
    let prefix = 'addBot';
    if (this.currentAction === 'edit') {
      prefix = 'editBot';
    }
    return this.getResource('maintainBot', prefix + '.' + key);
  }

}
