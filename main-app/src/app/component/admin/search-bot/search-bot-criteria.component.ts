import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router, UrlSegment} from '@angular/router';
import {CustomValidator, Option, SUBSCRIBER_TYPES} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {BotService} from '../../../service/bot.service';
import {BaseBotComponent} from '../../common/baseBot.component';


@Component({
  selector: 'seeradmin-search-bot-criteria',
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
        finalModel.statusCode = 'TESTING,LAUNCHED';
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
      return this.getResourceLocal('pageHeading');
    } else if (this.currentContext === 'testBot') {
      return this.getResourceLocal('pageHeadingTestBot');
    } else if (this.currentContext === 'launchBot') {
      return this.getResourceLocal('pageHeadingLaunchBot');
    }
  }

  getPageVerbiage(): string {
    if (this.botService.getActionContext() === 'editBot') {
      return this.getResourceLocal('editBotVerbiage');
    } else if (this.botService.getActionContext() === 'launchBot') {
      return this.getResourceLocal('launchBotVerbiage');
    } else if (this.botService.getActionContext() === 'testBot') {
      return this.getResourceLocal('testBotVerbiage');
    }
  }

  getResourceLocal(key: string): string {
    return this.getResource('searchBots', key);
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
}
