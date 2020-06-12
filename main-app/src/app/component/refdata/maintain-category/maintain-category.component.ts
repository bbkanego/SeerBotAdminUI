import { Component, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { ModalComponent } from 'my-component-library';
import { Subscription } from 'rxjs';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { CategoryService } from '../../../service/category.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-maintain-category',
  templateUrl: './maintain-category.component.html',
  styleUrls: ['./maintain-category.component.css']
})
export class MaintainCategoryComponent extends BaseBotComponent implements OnInit, OnDestroy {
  categoryForm: FormGroup;
  validationRules: any;
  validationRuleSubscription: Subscription;
  categoryServiceSubscription: Subscription;
  catModel: any;
  @ViewChild(ModalComponent) deleteCategoryModal: ModalComponent;

  constructor(injector: Injector, private categoryService: CategoryService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add') > -1) {
        this.currentAction = 'add';
        this.initCategoryModel();
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.initEditCategory();
      }
    });
  }

  private initEditCategory() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateCategoryRule').subscribe(rules => {
        this.validationRules = rules;
        this.categoryServiceSubscription = this.categoryService.getById(id).subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private initCategoryModel() {
    this.validationRuleSubscription = this.validationService.
      getValidationRuleMetadata('validateCategoryRule').subscribe(rules => {
        this.validationRules = rules;
        this.categoryServiceSubscription = this.categoryService.initModel().subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private createForm(model: any) {
    this.catModel = model;
    this.categoryForm = this.autoGenFormGroup(this.catModel, this.validationRules);
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.categoryServiceSubscription) {
      this.categoryServiceSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.categoryForm);

    if (this.categoryForm.valid) {
      const finalModel = this.categoryForm.value;
      this.categoryService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.categoryForm = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_CATEGORY_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_CATEGORY_SEARCH_RESULTS);
        }
      });
    }
  }

  revert() {
    if (this.catModel) {
      this.categoryForm = this.autoGenFormGroup(this.catModel, this.validationRules);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getResourceLocal(key: string) {
    return this.getResource('refData', key);
  }

  delete() {
    this.deleteCategoryModal.hide();
    this.categoryService.delete(this.catModel.id).subscribe(res => {
      this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_CATEGORY_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_CATEGORY_SEARCH_RESULTS);
    });
  }

  showDeleteModel() {
    this.deleteCategoryModal.show();
  }

  showDeleteButton() {
    return this.catModel.id !== null && this.catModel.deleteAllowed;
  }
}
