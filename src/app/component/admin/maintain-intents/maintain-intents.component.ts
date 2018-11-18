import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BaseReactiveComponent, Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { IntentService } from '../../../service/intent.service';
import { BIZ_BOTS_CONSTANTS } from '../../model/Constants';

@Component({
  selector: 'app-maintain-intents',
  templateUrl: './maintain-intents.component.html',
  styleUrls: ['./maintain-intents.component.css']
})
export class MaintainIntentsComponent extends BaseReactiveComponent implements OnInit, OnDestroy {
  allIntents;
  intentsForm: FormGroup;
  intentsModel;
  category: Option[] = [];
  private intentsSubscription: Subscription;
  private validationRuleSubscription: Subscription;
  validationRules: any;
  createButtonLabel = 'Create';
  private currentAction = 'add';
  private currentEditCategory = null;

  constructor(injector: Injector, private intentService: IntentService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  private createForm() {
    this.intentsForm = this.autoGenFormGroup(
      this.intentsModel, this.validationRules);
  }

  private initComponent(path: string): void {
    if (this.currentAction === 'edit') {
      this.currentEditCategory = this.intentsModel.category;
      this.intentsModel.category = null;
      this.createForm();
      // need this when we reset the form!
      this.intentsModel.category = this.currentEditCategory;
    } else {
      this.createForm();
    }

    this.category = [];
    this.category.push(new Option('', 'None'));
    for (const entry of this.intentsModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }

    if (this.currentEditCategory != null) {
      this.intentsForm.get('category').setValue(this.currentEditCategory.code);
    }

    if (this.currentAction === 'edit') {
      this.notificationService.notifyAny(this.intentsForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }

  private loadUtterance(path) {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateIntentRule').subscribe(rules => {
        this.validationRules = rules;
        this.intentsSubscription = this.intentService.initModel().subscribe((model) => {
          this.intentsModel = model;
          this.initComponent(path);
        });
      });
  }

  private editUtterance(path, id) {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateIntentRule').subscribe(rules => {
        this.validationRules = rules;
        this.intentsSubscription = this.intentService.getById(id).subscribe((model) => {
          this.intentsModel = model;
          this.initComponent(path);
        });
      });
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add-intent') > -1) {
        this.loadUtterance(path);
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.activatedRoute.params.subscribe(params => {
          const id = params['id'];
          this.editUtterance(path, id);
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intentsSubscription) {
      this.intentsSubscription.unsubscribe();
    }
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
  }

  onSubmit(eventObj) {
    if (this.intentsForm.invalid) {

    } else {
      const selectedCat = this.intentsForm.get('category').value;
      const targetCat = this.intentsModel.referenceData.categories.filter(element => element.code === selectedCat);
      this.intentsForm.get('category').setValue(targetCat[0]);
      const finalModel = this.intentsForm.value;
      this.intentService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.intentsForm = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS, 
              BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS);
        }
      });
    }
  }

  cancel() {
    if (this.currentAction === 'add') {
      this.router.navigate(['/dashboard']);
    } else {
      this.intentsForm = null;
    }
  }

  revert() {
    if (this.intentsModel) {
      this.initComponent('');
      this.notificationService.notifyAny(this.intentsForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }
}
