import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { BaseReactiveComponent, Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { IntentService } from '../../../service/intent.service';

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

  constructor(injector: Injector, private intentService: IntentService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  private createForm() {
    this.intentsForm = this.autoGenFormGroup(
      this.intentsModel, this.validationRules);
  }

  private initComponent(path: string): void {
    this.createForm();

    this.category.push(new Option('', 'None'));
    for (const entry of this.intentsModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add-intent') > -1) {
        this.validationRuleSubscription = this.validationService
          .getValidationRuleMetadata('validateIntentRule').subscribe(rules => {
            this.validationRules = rules;
            this.intentsSubscription = this.intentService.initModel().subscribe((model) => {
              this.intentsModel = model;
              this.initComponent(path);
            });
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
        this.router.navigate(['/dashboard']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  revert() {
    if (this.intentsModel) {
      this.createForm();
      this.notificationService.notifyAny(this.intentsForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }
}
