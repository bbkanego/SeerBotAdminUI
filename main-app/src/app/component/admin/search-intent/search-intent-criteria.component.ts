import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Option, SUBSCRIBER_TYPES} from 'seerlogics-ngui-components';
import {ActivatedRoute, Params, Router, UrlSegment} from '@angular/router';
import {IntentService} from '../../../service/intent.service';
import {BaseBotComponent} from '../../common/baseBot.component';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'seeradmin-search-intent-criteria',
  templateUrl: './search-intent-criteria.component.html',
  styleUrls: ['./search-intent-criteria.component.css']
})
export class SearchIntentCriteriaComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  searchModel: any;
  intentSearchForm: FormGroup;
  category: Option[] = [];
  validationRuleSubscription: Subscription;
  validationRules: any;
  intentSubscription: Subscription;
  currentContext: string;

  constructor(
    injector: Injector,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private intentService: IntentService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.currentAction = 'search';
    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      this.currentContext = qParams['action'];
      this.intentService.setActionContext(this.currentContext);
      this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
        const path = urlSegment.join('/');
        if (path.indexOf('start_search_intent') > -1) {
          this.initSearchModel();
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.intentSubscription) {
      this.intentSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.intentSearchForm);
    if (this.intentSearchForm.valid) {
      const selectedCat = this.intentSearchForm.get('category').value;
      const targetCat = this.searchModel.referenceData.categories.filter(
        element => element.code === selectedCat
      );
      const finalModel = this.intentSearchForm.value;
      finalModel.category = targetCat[0];
      this.intentService.setIntentSearchForm(finalModel);
      this.router.navigate(['/admin/search_intent']);
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
    if (this.currentContext === 'predefined') {
      return this.getResource('searchIntents', 'pageHeadingPredefined');
    } else {
      return this.getResource('searchIntents', 'pageHeadingCustom');
    }
  }

  private initSearchModel() {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateSearchIntentRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.getSearchModel();
      });
  }

  private createForm() {
    this.intentSearchForm = this.autoGenFormGroup(
      this.searchModel,
      this.validationRules
    );

    this.category = this.buildOptions(this.searchModel.referenceData.categories);

    // this.intentSearchForm.get('category').setValidators(CustomValidator.isSelectValid());
  }

  private getSearchModel() {
    this.intentSubscription = this.intentService
      .getSearchIntentsModel()
      .subscribe(model => {
        this.searchModel = model;
        this.createForm();
      });
  }
}
