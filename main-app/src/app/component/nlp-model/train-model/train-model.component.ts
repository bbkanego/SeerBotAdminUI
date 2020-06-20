import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router, UrlSegment} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {CustomValidator, ModalComponent, Notification, SUBSCRIBER_TYPES} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {NlpModelService} from '../../../service/nlp-model.service';
import {BaseBotComponent} from '../../common/baseBot.component';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css']
})
export class TrainModelComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  trainModel: any;
  trainForm: FormGroup;
  currentAction = 'start';
  category = [];
  validationRuleSubscription: Subscription;
  viewModelSubscription: Subscription;
  currentContext: string;
  @ViewChild(ModalComponent) deleteModelModal: ModalComponent;
  private validationRules;

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private nlpService: NlpModelService,
    private router: Router
  ) {
    super(injector);
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

    this.notificationService.onNotification().subscribe((eventData: Notification) => {
      if (eventData.subscriberType === SUBSCRIBER_TYPES.ERROR_400) {
        console.log('show error  message = ' + JSON.stringify(eventData.message));
      }
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

  delete() {
    const id = this.trainModel.id;
    this.deleteModelModal.hide();
    this.nlpService.delete(id).subscribe(() => {
      this.notificationService.notify(
        'Refresh Results!',
        BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS
      );
      this.trainModel = null;
    });
  }

  reTrainModel(id) {
    this.nlpService.reTrainModel(id).subscribe(() => {
      this.notificationService.notify(
        'Refresh Results!',
        BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS
      );
      this.trainModel = null;
    });
  }

  getResourceLocal(key) {
    return this.getResource('maintainModels', key);
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

  onSubmit(event) {
    this.markFormGroupTouched(this.trainForm);
    if (this.trainForm.valid) {
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

  showDeleteModel() {
    this.deleteModelModal.show();
  }

  isDeleteAllowed() {
    return this.trainModel.deleteAllowed;
  }

  private createForm(): void {
    this.trainForm = this.autoGenFormGroup(
      this.trainModel,
      this.validationRules
    );
    this.trainForm.get('category').setValidators(CustomValidator.isSelectValid());
  }

  private initComponent(): void {
    this.createForm();

    // prepare the drop downs.
    this.category = this.buildOptions(this.trainModel.referenceData.categories);
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
}
