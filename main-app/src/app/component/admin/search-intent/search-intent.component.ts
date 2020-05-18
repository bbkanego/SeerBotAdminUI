import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {CopyIntents, IntentService} from '../../../service/intent.service';
import {BaseBotComponent} from '../../common/baseBot.component';
import {CustomValidator, ModalComponent, Option} from 'my-component-library';
import {FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-search-intent',
  templateUrl: './search-intent.component.html',
  styleUrls: ['./search-intent.component.css']
})
export class SearchIntentComponent extends BaseBotComponent implements OnInit, OnDestroy {
  intentsResults;
  allIntents: Subscription;
  intentCopyForm: FormGroup;
  category: Option[] = [];
  intentsCopyModel: CopyIntents = {sourceCategoryTypeCode: '', sourceCategoryCode: '', targetCategoryCode: ''};
  cmsContent = {};
  noResultsFoundMessage = 'No results were found. You can "Add New" intents or copy existing from predefined Bots';

  @ViewChild("deleteIntentsModalComp") deleteIntentsModal: ModalComponent;
  @ViewChild("copyIntentsModalComp") copyIntentsModal: ModalComponent;
  @ViewChild('intentUpdated') intentUpdated: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private intentService: IntentService,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.cmsContent = this.commonService.cmsContent;
    const searchModel = this.intentService.getIntentSearchModel();
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.searchIntents(searchModel);
    });

    this.notificationService.onNotification().subscribe((data: any) => {
      if (
        data.subscriberType ===
        BIZ_BOTS_CONSTANTS.REFRESH_INTENTS_SEARCH_RESULTS
      ) {
        this.router.navigate(['/admin/search_intent']);
        this.showToast(this.intentUpdated);
      }
    });

    this.createIntentsCopyForm();
  }

  private createIntentsCopyForm() {
    this.intentCopyForm = this.autoGenFormGroup(
      this.intentsCopyModel, []
    );
    this.intentCopyForm.get('sourceCategoryCode').setValidators(Validators.required);
    // the below is required for the red asterik to show up
    this.intentCopyForm.get('sourceCategoryCode').validationRules['required'] = true;
    this.category = this.buildOptions(this.getSearchIntentsModel().referenceData.categories);
  }

  getSearchIntentsModel() {
    return this.intentService.getSessionStorageItem('searchIntentsModel');
  }

  private searchIntents(model) {
    if (!model) {
      model = this.getSearchIntentsModel();
    } else {
      this.intentService.setSessionStorageItem('searchIntentsModel', model);
    }
    this.allIntents = this.intentService
      .searchIntents(model)
      .subscribe(results => {
        this.intentsResults = results;
        this.intentService.setAllIntents(this.intentsResults);
      });
  }

  ngOnDestroy(): void {
    if (this.allIntents) {
      this.allIntents.unsubscribe();
    }
  }

  editIntent(id: string) {
    this.router.navigate(['edit', id], {
      queryParams: {action: this.intentService.getActionContext()},
      relativeTo: this.activatedRoute
    });
  }

  addIntent() {
    this.router.navigate(['add'], {
      queryParams: {action: 'fromEdit'},
      relativeTo: this.activatedRoute
    });
  }

  getHeading(): string {
    const localCms = this.cmsContent['searchIntents'];
    if (this.intentService.getActionContext() === 'predefined') {
      return localCms.pageHeadingPredefined;
    } else {
      return localCms.pageHeadingCustom;
    }
  }

  getResourceLocal(key: string): string {
    return this.getResource('searchIntents', key);
  }

  showDeleteAllPopup() {
    this.deleteIntentsModal.show();
  }

  showCopyIntentsPopup() {
    this.copyIntentsModal.show();
  }

  hideCopyIntentsPopup() {
    this.copyIntentsModal.hide();
  }

  copyIntentsFromSourceToTarget() {
    const copyIntentsModel: CopyIntents = {sourceCategoryCode: '', sourceCategoryTypeCode: 'PREDEFINED'};
    this.intentService.copyPredefinedIntents(copyIntentsModel).subscribe(() => {
      this.router.navigate(['/admin/search_intent']);
    });
  }

  backToCriteria() {
    const model = this.getSearchIntentsModel();
    const intentType: string = model.intentType;
    this.router.navigate(['/admin/start_search_intent'],
      {queryParams: {action: intentType.toLowerCase()}});
  }

  deleteAllIntents() {
    const model = this.getSearchIntentsModel();
    const catCode = model.category.code;
    this.intentService.deleteAllIntentsByCategory(catCode).subscribe(res => {
      this.router.navigate(['/dashboard']);
    });
  }

  copyIntents() {
    const model = this.getSearchIntentsModel();
    const catCode = model.category.code;

    this.markFormGroupTouched(this.intentCopyForm);
    if (this.intentCopyForm.valid) {
      const copyIntentsModel: CopyIntents = this.intentCopyForm.value as CopyIntents;
      copyIntentsModel.targetCategoryCode = this.getSearchIntentsModel().category.code;
      const sourceCategory = this.getSearchIntentsModel().referenceData.categories.filter(
        element => element.code === copyIntentsModel.sourceCategoryCode
      );
      copyIntentsModel.sourceCategoryTypeCode = sourceCategory[0].type;
      console.log(copyIntentsModel);
      this.intentService.copyPredefinedIntents(copyIntentsModel).subscribe(res => {
        this.hideCopyIntentsPopup();
        this.ngOnInit();
        this.router.navigate(['/admin/search_intent']);
      });
    }

    /*this.intentService.deleteAllIntentsByCategory(catCode).subscribe(res => {
      this.router.navigate(['/dashboard']);
    });*/
  }
}
