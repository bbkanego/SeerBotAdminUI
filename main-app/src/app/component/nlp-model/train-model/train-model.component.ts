import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import {
  BaseReactiveComponent,
  Option,
  SUBSCRIBER_TYPES
} from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';
import { NlpModelService } from '../../../service/nlp-model.service';
import { BaseBotComponent } from '../../common/baseBot.component';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css']
})
export class TrainModelComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  trainModel: any;
  trainForm: FormGroup;
  private validationRules;
  currentAction = 'start';
  category = [];
  validationRuleSubscription: Subscription;
  viewModelSubscription: Subscription;
  currentContext: string;

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private nlpService: NlpModelService,
    private router: Router
  ) {
    super(injector);
  }

  private createForm(): void {
    this.trainForm = this.autoGenFormGroup(
      this.trainModel,
      this.validationRules
    );
  }

  private initComponent(): void {
    this.createForm();

    // prepare the drop downs.
    this.category = [];
    this.category.push(new Option('', 'None'));
    for (const entry of this.trainModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      this.currentContext = qParams['action'];
      this.nlpService.setActionContext(this.currentContext);
      this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
        const path = urlSegment.join('/');
        if (path.indexOf('start') > -1) {
          this.startTrain();
        } else if (path.indexOf('view') > -1) {
          this.viewModel();
        }
      });
    });
  }

  viewModel() {
    this.currentAction = 'edit';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.viewModelSubscription = this.nlpService
      .getById(id)
      .subscribe(model => {
        this.trainModel = model;
      });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  delete(id) {
    this.nlpService.delete(id).subscribe(() => {
      this.notificationService.notify(
        'Refresh Results!',
        BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS
      );
      this.trainModel = null;
    });
  }

  getResource(context, key) {
    const resources = this.commonService.cmsContent['maintainModels'];
    return resources[context][key];
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.viewModelSubscription) {
      this.viewModelSubscription.unsubscribe();
    }
  }

  revert() {
    if (this.trainModel) {
      this.createForm();
      this.notificationService.notifyAny(
        this.trainForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }

  private startTrain() {
    this.currentAction = 'add';
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateTrainModelRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.viewModelSubscription = this.nlpService
          .initModel()
          .subscribe(model => {
            this.trainModel = model;
            this.initComponent();
          });
      });
  }

  onSubmit(event) {
    if (this.trainForm.invalid) {
    } else {
      const selectedCat = this.trainForm.get('category').value;
      const targetCat = this.trainModel.referenceData.categories.filter(
        element => element.code === selectedCat
      );
      this.trainForm.get('category').setValue(targetCat[0]);
      const finalModel = this.trainForm.value;
      this.nlpService.trainModel(finalModel).subscribe(res => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
