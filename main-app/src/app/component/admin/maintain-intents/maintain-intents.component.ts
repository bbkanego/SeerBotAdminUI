import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ActivatedRoute, Params, Router, UrlSegment} from '@angular/router';
import {CustomValidator, ModalComponent, Option, SelectorComponent, SUBSCRIBER_TYPES} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/frozenEnvironment';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {CopyIntents, IntentService} from '../../../service/intent.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'seeradmin-maintain-intents',
  templateUrl: './maintain-intents.component.html',
  styleUrls: ['./maintain-intents.component.css']
})
export class MaintainIntentsComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  allIntents;
  intentsForm: FormGroup;
  intentsModel;
  category: Option[] = [];
  responseTypes: Option[] = [];
  validationRules: any;
  @ViewChild('intentsFile') intentsFile: ElementRef;
  @ViewChild('showFileName') showFileName: ElementRef;
  @ViewChild('utteranceTextBox') utteranceTextBox: ElementRef;
  @ViewChild('intentTextBox') intentTextBox: ElementRef;
  @ViewChild('selectCategory') selectCategory: SelectorComponent;
  selectedEntryOption = 'enterDetails';
  problemWithUpload = false;
  showRadioOptions = true;
  currentContext = 'NONE';
  cmsContent;
  locales: Option[] = [];
  @ViewChild(ModalComponent) deleteIntentModal: ModalComponent;
  modalState: string;
  deleteModalBody = 'Do you want to delete?';
  deleteModalHeading = 'Delete Intent?';
  private intentsSubscription: Subscription;
  private validationRuleSubscription: Subscription;
  private currentEditCategory = null;

  constructor(
    injector: Injector,
    private intentService: IntentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  get utterances(): FormArray {
    return this.intentsForm.get('utterances') as FormArray;
  }

  get responses(): FormArray {
    return this.intentsForm.get('responses') as FormArray;
  }

  get mayBeIntentResponses(): FormArray {
    const mayBeResponses: FormArray = this.getMayBeIntentFormGroup().get('responses') as FormArray;
    for (const mayBeResponse of mayBeResponses.controls) {
      mayBeResponse.get('locale').setValue('en'); // .setValidators(CustomValidator.isSelectValid());
    }
    return mayBeResponses;
  }

  ngOnInit() {
    this.cmsContent = this.commonService.cmsContent['maintainIntents'];
    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      this.currentContext = qParams['action'];
      this.intentService.setActionContext(this.currentContext);
      this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
        const path = urlSegment.join('/');
        if (path.indexOf('add_intent') > -1) {
          this.loadIntentsForm(path);
        } else if (path.indexOf('edit') > -1) {
          this.currentAction = 'edit';
          const id = this.activatedRoute.snapshot.paramMap.get('id');
          this.editUtterance(path, id);
        } else if (path.indexOf('add') > -1) {
          if (qParams.action === 'fromEdit') {
            this.currentAction = 'addFromEdit';
          }
          this.loadIntentsForm(path);
        }
      });
    });
  }

  getUtteranceGroup(intent: IntentUtterance): FormGroup {
    const utterance: FormGroup = this.autoGenFormGroup(
      intent,
      this.findValidatorRuleForProperty(this.validationRules, 'utterances')
        .fields
    );
    utterance.get('locale').setValue('en'); // .setValidators(CustomValidator.isSelectValid());
    return utterance;
  }

  /**
   * This creates the formGroup for the "exact match" response.
   * Here we will hard code the responseType to 'static'
   * @param response
   */
  getResponseGroup(response: IntentResponse): FormGroup {
    const responses: FormGroup = this.autoGenFormGroup(
      response,
      this.findValidatorRuleForProperty(this.validationRules, 'responses')
        .fields
    );
    responses.get('responseType').setValue('STATIC');
    // responses.get('responseType').setValidators(CustomValidator.isSelectValid());
    responses.get('locale').setValue('en');
    // .setValidators(CustomValidator.isSelectValid());
    return responses;
  }

  getMayBeIntentFormGroup(): FormGroup {
    return this.intentsForm.get('mayBeIntent') as FormGroup;
  }

  addUtterance() {
    this.utterances.push(this.getUtteranceGroup(new IntentUtterance()));
  }

  removeLastUtterance() {
    if (this.utterances.length > 0) {
      this.utterances.removeAt(this.utterances.length - 1);
    }
  }

  removeCurrentUtterance(index) {
    if (this.utterances.length > 0) {
      this.utterances.removeAt(index);
    }
  }

  addResponse() {
    this.responses.push(this.getResponseGroup(new IntentResponse()));
  }

  removeLastResponse() {
    if (this.responses.length > 0) {
      this.responses.removeAt(this.responses.length - 1);
    }
  }

  ngOnDestroy(): void {
    if (this.intentsSubscription) {
      this.intentsSubscription.unsubscribe();
    }
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
  }

  selectEntryType(type) {
    this.selectedEntryOption = type;
    // this.initComponent('');
  }

  getSubmitButtonLabel() {
    let label = this.getCommonResources('saveButton');
    if (this.selectedEntryOption === 'copy') {
      label = this.getResourceLocal('addIntent.copyIntents');
    }
    return label;
  }

  onSubmit() {
    this.markFormGroupTouched(this.intentsForm);
    if (this.selectedEntryOption === 'enterDetails') {
      if (this.intentsForm.valid) {
        const selectedCat = this.intentsForm.get('category').value;
        const targetCat = this.intentsModel.referenceData.categories.filter(
          element => element.code === selectedCat
        );
        // this.intentsForm.get('category').setValue(targetCat[0]);
        const intentModel = this.intentsForm.value;
        intentModel.category = targetCat[0];
        this.submitEachEntryForm(intentModel);
      }
    } else if (this.selectedEntryOption === 'upload') {
      this.submitMultiPartForm();
    } else if (this.selectedEntryOption === 'copy') {
      this.copyPredefinedIntents();
    }
  }

  fileCount(): number {
    if (this.intentsFile) {
      const intentsFile: FileList = this.intentsFile.nativeElement.files;
      return intentsFile.length;
    }
  }

  showfileRequiredError(): boolean {
    return this.fileCount() === 0;
  }

  delete() {
    this.deleteIntentModal.hide();
    const id = this.intentsModel.id;
    this.intentService.delete(id).subscribe(res => {
      this.notificationService.notify(
        'Refresh Results!',
        BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS,
        BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS
      );
    });
  }

  showDeleteModel() {
    this.deleteIntentModal.show();
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
      this.notificationService.notifyAny(
        this.intentsForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }

  getFileUploadUrl() {
    return environment.UPLOAD_PREDEF_INTENT;
  }

  fileChangeEvent(fileChangeEvent: any) {
    if (fileChangeEvent.target.files && fileChangeEvent.target.files[0]) {
      this.showFileName.nativeElement.value =
        fileChangeEvent.target.files[0].name;
    }
  }

  getResourceLocal(key: string) {
    return this.getResource('maintainIntents', key);
  }

  getHeading() {
    if (this.currentAction === 'add' || this.currentAction === 'addFromEdit') {
      if (this.currentContext === 'predefined') {
        return this.cmsContent.addIntent.pageHeadingPredefined;
      } else {
        return this.cmsContent.addIntent.pageHeadingCustom;
      }
    } else {
      if (this.currentContext === 'predefined') {
        return this.cmsContent.editIntent.pageHeadingPredefined;
      } else {
        return this.cmsContent.editIntent.pageHeadingCustom;
      }
    }
  }

  errorModelState($event): void {
    this.modalState = $event;
  }

  isDeleteAllowed() {
    return this.intentsModel.id !== null;
  }

  canAddUtterance() {
    return this.intentsModel.intent !== 'DoNotUnderstandIntent' && this.intentsModel.intent !== 'Initiate';
  }

  private createForm() {
    this.intentsForm = this.autoGenFormGroup(
      this.intentsModel,
      this.validationRules
    );
    this.intentsForm.get('category').setValidators(CustomValidator.isSelectValid());
    if (this.currentAction.indexOf('add') > -1) {
      this.addUtterance();
      this.addResponse();
    }
  }

  private initComponent(path: string): void {
    if (this.currentAction === 'edit') {
      this.showRadioOptions = false;
      this.currentEditCategory = this.intentsModel.category;
      this.intentsModel.category = null;
      this.createForm();
      // need this when we reset the form!
      this.intentsModel.category = this.currentEditCategory;
    } else {
      this.createForm();
    }

    this.category = this.buildOptions(
      this.intentsModel.referenceData.categories
    );
    this.responseTypes = this.buildOptions(
      this.intentsModel.referenceData.responseTypes
    );
    this.locales = this.buildOptions(this.intentsModel.referenceData.locales);

    if (this.currentEditCategory != null) {
      this.intentsForm.get('category').setValue(this.currentEditCategory.code);
    }

    this.currentFormGroup = this.intentsForm;

    if (this.currentAction === 'edit') {
      this.notificationService.notifyAny(
        this.intentsForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }

  private loadIntentsForm(path) {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateIntentRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.intentsSubscription = this.intentService
          .initModel()
          .subscribe(model => {
            this.intentsModel = model;
            this.initComponent(path);
          });
      });
  }

  private editUtterance(path, id) {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateIntentRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.intentsSubscription = this.intentService
          .getById(id)
          .subscribe(model => {
            this.intentsModel = model;
            this.initComponent(path);
          });
      });
  }

  private submitEachEntryForm(intentModel) {
    this.intentService.save(intentModel).subscribe(res => {
      if (this.currentAction === 'add') {
        this.router.navigate(['/dashboard']);
      } else {
        // this.intentsForm = null;
        this.notificationService.notify(
          'Refresh Results!',
          BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS,
          BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS
        );
      }
    });
  }

  private copyPredefinedIntents() {
    const selectedCat = this.selectCategory.selectWidget.nativeElement.value;
    const copyIntentsModel: CopyIntents = {sourceCategoryCode: selectedCat, sourceCategoryTypeCode: 'PREDEFINED'};
    this.intentService.copyPredefinedIntents(selectedCat).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  private submitMultiPartForm() {
    const intentsFile: FileList = this.intentsFile.nativeElement.files;
    if (intentsFile.length > 0) {
      const formData = new FormData();
      const selectedCat = this.selectCategory.selectWidget.nativeElement.value;
      formData.append('intentsData', intentsFile[0], intentsFile[0].name);
      formData.append('category', selectedCat);
      this.intentService.saveMultiPart(formData).subscribe((response: any) => {
        if (response === true) {
          this.router.navigate(['/dashboard']);
        } else {
          this.problemWithUpload = true;
        }
      });
    }
  }
}

export class IntentUtterance {
  utterance = '';
  locale = '';
}

export class IntentResponse {
  response = '';
  responseType = '';
  locale = '';
}
