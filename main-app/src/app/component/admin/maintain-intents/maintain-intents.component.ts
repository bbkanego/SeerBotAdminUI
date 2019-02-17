import {
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { Option, SUBSCRIBER_TYPES, SelectComponent } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../environments/environment';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { IntentService } from '../../../service/intent.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-maintain-intents',
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
  private intentsSubscription: Subscription;
  private validationRuleSubscription: Subscription;
  validationRules: any;
  private currentEditCategory = null;
  @ViewChild('intentsFile') intentsFile: ElementRef;
  @ViewChild('showFileName') showFileName: ElementRef;
  @ViewChild('utteranceTextBox') utteranceTextBox: ElementRef;
  @ViewChild('intentTextBox') intentTextBox: ElementRef;
  @ViewChild('selectCategory') selectCategory: SelectComponent;
  selectedEntryOption = 'enterDetails';
  problemWithUpload = false;
  showRadioOptions = true;
  currentContext = 'NONE';
  cmsContent;

  constructor(
    injector: Injector,
    private intentService: IntentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  private createForm() {
    this.intentsForm = this.autoGenFormGroup(
      this.intentsModel,
      this.validationRules
    );
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

    this.category = this.buildOptions(this.intentsModel.referenceData.categories);
    this.responseTypes = this.buildOptions(this.intentsModel.referenceData.responseTypes);

    if (this.currentEditCategory != null) {
      this.intentsForm.get('category').setValue(this.currentEditCategory.code);
    }

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
        }
      });
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

  private submitEachEntryForm() {
    const finalModel = this.intentsForm.value;
    this.intentService.save(finalModel).subscribe(res => {
      if (this.currentAction === 'add') {
        this.router.navigate(['/dashboard']);
      } else {
        this.intentsForm = null;
        this.notificationService.notify(
          'Refresh Results!',
          BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS,
          BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS
        );
      }
    });
  }

  selectEntryType(type) {
    this.selectedEntryOption = type;
    // this.initComponent('');
  }

  onSubmit() {
    if (this.selectedEntryOption === 'enterDetails') {
      const selectedCat = this.intentsForm.get('category').value;
      const targetCat = this.intentsModel.referenceData.categories.filter(
        element => element.code === selectedCat
      );
      this.intentsForm.get('category').setValue(targetCat[0]);
      if (this.intentsForm.valid) {
        this.submitEachEntryForm();
      }
    } else if (this.selectedEntryOption === 'upload') {
      this.submitMultiPartForm();
    } else if (this.selectedEntryOption === 'copy') {
      this.copyPredefinedIntents();
    }
  }

  private copyPredefinedIntents() {
    const selectedCat = this.selectCategory.selectWidget.nativeElement.value;
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

  fileCount(): number {
    if (this.intentsFile) {
      const intentsFile: FileList = this.intentsFile.nativeElement.files;
      return intentsFile.length;
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

  getHeading() {
    if (this.currentAction === 'add') {
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
}
