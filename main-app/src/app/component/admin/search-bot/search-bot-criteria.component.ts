import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { CustomValidator, Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';
import { BotService } from '../../../service/bot.service';
import { BaseBotComponent } from '../../common/baseBot.component';


@Component({
  selector: 'app-search-bot-criteria',
  templateUrl: './search-bot-criteria.component.html',
  styleUrls: ['./search-bot-criteria.component.css']
})
export class SearchBotCriteriaComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  searchModel: any;
  botSearchForm: FormGroup;
  category: Option[] = [];
  validationRuleSubscription: Subscription;
  validationRules: any;
  botSubscription: Subscription;
  currentContext: string;

  constructor(
    injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private botService: BotService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.currentAction = 'search';
    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      this.currentContext = qParams['action'];
      this.botService.setActionContext(this.currentContext);
      this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
        const path = urlSegment.join('/');
        if (path.indexOf('init_search_bot') > -1) {
          this.initSearchModel();
        }
      });
    });
  }

  private initSearchModel() {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateSearchBotsRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.getSearchModel();
      });
  }

  private createForm() {
    this.botSearchForm = this.autoGenFormGroup(
      this.searchModel,
      this.validationRules
    );

    this.category = [];
    this.category.push(new Option('_NONE_', 'None'));
    for (const entry of this.searchModel.referenceData.category) {
      this.category.push(new Option(entry.code, entry.name));
    }

    this.botSearchForm.get('category').setValidators(CustomValidator.isSelectValid());
  }

  private getSearchModel() {
    this.botSubscription = this.botService
      .getSearchBotModel()
      .subscribe(model => {
        this.searchModel = model;
        this.createForm();
      });
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.botSubscription) {
      this.botSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.botSearchForm);
    if (this.botSearchForm.valid) {
      this.mapSelectValue(this.botSearchForm, this.searchModel, 'category', 'category');
      const finalModel = this.botSearchForm.value;
      if (this.botService.getActionContext() === 'testBot') {
        finalModel.statusCode = 'LAUNCHED';
      } else if (this.botService.getActionContext() === 'launchBot') {
        finalModel.statusCode = 'DRAFT';
      } else if (this.botService.getActionContext() === 'editBot') {
        finalModel.statusCode = 'DRAFT';
      }
      this.botService.setSearchBotCriteriaModel(finalModel);
      this.router.navigate(['/admin/search_bot']);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  revert() {
    if (this.searchModel) {
      this.createForm();
      this.notificationService.notifyAny(
        this.searchModel,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }

  getHeading(): string {
    if (this.currentContext === 'editBot') {
      return this.getResource('searchBots', 'pageHeading');
    } else if (this.currentContext === 'testBot') {
      return this.getResource('searchBots', 'pageHeadingTestBot');
    } else if (this.currentContext === 'launchBot') {
      return this.getResource('searchBots', 'pageHeadingLaunchBot');
    }
  }
}
