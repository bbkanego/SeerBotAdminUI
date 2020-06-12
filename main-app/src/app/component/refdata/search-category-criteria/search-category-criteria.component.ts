import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../service/category.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-search-category-criteria',
  templateUrl: './search-category-criteria.component.html',
  styleUrls: ['./search-category-criteria.component.css']
})
export class SearchCategoryCriteriaComponent extends BaseBotComponent implements OnInit, OnDestroy {

  categorySearchForm: FormGroup;
  validationRuleSubscription: Subscription;
  validationRules: any;
  botServiceSubscription: Subscription;
  categoryModel: any;

  constructor(injector: Injector, private router: Router, private categoryService: CategoryService) {
    super(injector);
  }

  ngOnInit() {
    this.validationRuleSubscription = this.validationService.getValidationRuleMetadata('validateCategorySearchRule').subscribe(rules => {
      this.validationRules = rules;
      this.botServiceSubscription = this.categoryService.initModel().subscribe((model) => {
        this.categoryModel = model;
        this.initComponent();
      });
    });
  }

  private initComponent() {
    this.categorySearchForm = this.autoGenFormGroup(this.categoryModel, this.validationRules);
  }

  onSubmit() {
    this.markFormGroupTouched(this.categorySearchForm);
    if (this.categorySearchForm.valid) {
      const model = this.categorySearchForm.value;
      this.categoryService.setSearchCriteriaModel(model);
      this.router.navigate(['/ref-data/category/search']);
    }
  }

  getResourceLocal(key: string): string {
    return this.getResource('refData', key);
  }

  revertChanges() {
    this.initComponent();
  }

  ngOnDestroy() {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

}
