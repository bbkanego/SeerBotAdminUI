import {
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { IntentService } from '../../../service/intent.service';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { BaseBotComponent } from '../../common/baseBot.component';
import { environment } from '../../../environments/environment';

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
  private intentsSubscription: Subscription;
  private validationRuleSubscription: Subscription;
  validationRules: any;
  private currentEditCategory = null;
  @ViewChild('intentsFile') intentsFile: ElementRef;
  @ViewChild('showFileName') showFileName: ElementRef;
  enterEachItem = true;
  problemWithUpload = false;
  showRadioOptions = true;

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

    this.category = [];
    this.category.push(new Option('', 'None'));
    for (const entry of this.intentsModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }

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

  private loadUtterance(path) {
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
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add_intent') > -1) {
        this.loadUtterance(path);
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.editUtterance(path, id);
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

  private submitEachEntryForm() {
    const selectedCat = this.intentsForm.get('category').value;
    const targetCat = this.intentsModel.referenceData.categories.filter(
      element => element.code === selectedCat
    );
    this.intentsForm.get('category').setValue(targetCat[0]);
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
    if ('enterDetails' === type) {
      this.enterEachItem = true;
    } else {
      this.enterEachItem = false;
    }
  }

  onSubmit() {
    if (this.enterEachItem) {
      if (this.intentsForm.valid) {
        this.submitEachEntryForm();
      }
    } else {
      this.submitMultiPartForm();
    }
  }

  private submitMultiPartForm() {
    const intentsFile: FileList = this.intentsFile.nativeElement.files;
    if (intentsFile.length > 0) {
      const formData = new FormData();
      formData.append('intentsData', intentsFile[0], intentsFile[0].name);
      formData.append('category', this.intentsForm.get('category').value);
      this.intentService.saveMultiPart(formData).subscribe((response: any) => {
        if (response === true) {
          this.router.navigate(['/dashboard']);
        } else {
          this.problemWithUpload = true;
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
      this.showFileName.nativeElement.value = fileChangeEvent.target.files[0].name;
    }
  }
}
