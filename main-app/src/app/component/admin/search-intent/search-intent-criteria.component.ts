import { Component, OnDestroy, OnInit, Injector } from '@angular/core';
import { CommonService, Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { IntentService } from '../../../service/intent.service';
import { BaseBotComponent } from '../../common/baseBot.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-intent-criteria',
  templateUrl: './search-intent-criteria.component.html',
  styleUrls: ['./search-intent-criteria.component.css']
})
export class SearchIntentCriteriaComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  searchModel: any;
  intentSearchForm: FormGroup;
  category: Option[] = [];
  validationRuleSubscription: any;
  validationRules: any;

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
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('init-search-intent') > -1) {
        this.initSearchModel();
      }
    });
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

    this.category = [];
    this.category.push(new Option('', 'None'));
    for (const entry of this.searchModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }
  }

  private getSearchModel() {
    this.intentService.getSearchIntentsModel().subscribe(model => {
      this.searchModel = model;
      this.createForm();
    });
  }

  ngOnDestroy(): void {}

  onSubmit(event) {
    if (this.intentSearchForm.valid) {
      const selectedCat = this.intentSearchForm.get('category').value;
      const targetCat = this.searchModel.referenceData.categories.filter(element => element.code === selectedCat);
      const finalModel = this.intentSearchForm.value;
      finalModel.category = targetCat[0];
      this.intentService.setIntentSearchForm(finalModel);
      this.router.navigate(['/admin/search-intent']);
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
}
