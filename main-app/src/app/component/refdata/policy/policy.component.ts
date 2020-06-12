import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { CustomFormControl } from 'my-component-library';
import { Subscription } from 'rxjs';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { PolicyService } from '../../../service/policy.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent extends BaseBotComponent implements OnInit, OnDestroy {

  policyForm: FormGroup;
  validationRules: any;
  validationRuleSubscription: Subscription;
  policySubscription: Subscription;
  policyModel: any;
  currentAction: string;
  actionsOptions: any[];
  resourcesOptions: any[];
  effectsOptions: any[];
  multiSelectStartValuesArray: any[] = [];

  constructor(injector: Injector, private policyService: PolicyService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add') > -1) {
        this.currentAction = 'add';
        this.initPolicyModel();
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.initEditPolicy();
      }
    });
  }

  get statements(): FormArray {
    return this.policyForm.get('statements') as FormArray;
  }

  private initEditPolicy() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validatePolicyRule').subscribe(rules => {
        this.validationRules = rules;
        this.policySubscription = this.policyService.getById(id).subscribe((model) => {
          this.createForm(model);
          this.setValuesForEdit(model);
        });
      });
  }

  private setValuesForEdit(model) {
    model.statements.forEach((statement) => {
      const multiSelectStartValues: any[] = [];
      this.multiSelectStartValuesArray.push(multiSelectStartValues);
      statement.actions.forEach((action) => {
        multiSelectStartValues.push({value: action.code, label: action.name});
      });
    });
  }

  private initPolicyModel() {
    this.validationRuleSubscription = this.validationService.
      getValidationRuleMetadata('validatePolicyRule').subscribe(rules => {
        this.validationRules = rules;
        this.policySubscription = this.policyService.initModel().subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private buildReferenceDataDD() {
    this.actionsOptions = this.buildOptions(this.policyModel.referenceData['actions']);
    this.effectsOptions = this.buildOptions(this.policyModel.referenceData['effects']);
    this.resourcesOptions = this.buildOptions(this.policyModel.referenceData['resources']);
  }

  private createForm(model: any) {
    this.policyModel = model;
    this.policyForm = this.autoGenFormGroup(this.policyModel, this.validationRules);
    this.buildReferenceDataDD();

    // const statements: FormControl = this.policyForm.get('statements') as FormControl;
    this.statements.controls.forEach((statementGrp: FormGroup) => {
      this.addSelectActionsControl(statementGrp);
    });
  }

  addStatement() {
    this.statements.push(this.getStatementGroup(new Statement()));
  }

  isActionsRequired() {
    let returnVal = false;
    this.findValidatorRuleForProperty(this.validationRules, 'statements').fields.forEach(element => {
      if (element.property === 'actions' && element.depends.indexOf('required') !== -1) {
        returnVal = true;
      }
    });
    return returnVal;
  }

  addSelectActionsControl(statementGrp: FormGroup) {
    if (this.isActionsRequired()) {
      const actionsControl = new CustomFormControl(null, Validators.required);
      actionsControl.validationRules['required'] = true;
      statementGrp.addControl('selectActions', actionsControl);
    }
  }

  getStatementGroup(statement: Statement): FormGroup {
    const statementGrp: FormGroup = this.autoGenFormGroup(statement,
      this.findValidatorRuleForProperty(this.validationRules, 'statements').fields);
    this.addSelectActionsControl(statementGrp);
    // const resourceCodeControl: CustomFormControl = statementGrp.get('resourceCode') as CustomFormControl;
    // resourceCodeControl.validationRules['required'] = true;
    return statementGrp;
  }

  removeLastStatement() {
    if (this.statements.length > 0) {
      this.statements.removeAt(this.statements.length - 1);
    }
  }

  removeCurrentStatement(index) {
    if (this.statements.length > 0) {
      this.statements.removeAt(index);
    }
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.policySubscription) {
      this.policySubscription.unsubscribe();
    }
  }

  private setActions(policyModel) {
    // const statements: FormControl = this.policyForm.get('statements') as FormControl;
    const allActions: any[] = this.policyModel.referenceData['actions'];
    let index = 0;
    this.statements.controls.forEach((statementGrp: FormGroup) => {
      const selectedActions: CustomFormControl = statementGrp.get('selectActions') as CustomFormControl;
      const actionCodes: string[] = selectedActions.value.split(',');
      policyModel.statements[index].actions = [];
      actionCodes.forEach((value) => {
        allActions.forEach((action) => {
          if (action.code === value) {
            policyModel.statements[index].actions.push(action);
          }
        });
      });

      const resource: CustomFormControl = statementGrp.get('resourceCode') as CustomFormControl;
      const resourceObj = policyModel.referenceData.resources.filter(element => element.code === resource.value);
      policyModel.statements[index].resource = resourceObj[0];

      index++;
    });
  }

  onSubmit() {
    this.markFormGroupTouched(this.policyForm);

    if (this.policyForm.valid) {
      const finalModel = this.policyForm.value;
      this.setActions(finalModel);
      this.policyService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.policyForm = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_POLICY_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_POLICY_SEARCH_RESULTS);
        }
      });
    }
  }

  revert() {
    if (this.policyModel) {
      this.createForm(this.policyModel);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getResourceLocal(key: string) {
    return this.getResource('refData', key);
  }

  handleChange(event) {
    console.log('Value is = ' + event.target.value);
  }

  processSelectedValues(values, statementGrp: FormGroup) {
    const actions: CustomFormControl = statementGrp.get('actions') as CustomFormControl;
    actions.setValue(values.join());
  }

  processResourceSelection(event, statementGrp: FormGroup) {
    const resourceCode: CustomFormControl = statementGrp.get('resourceCode') as CustomFormControl;
    statementGrp.get('resource').setValue(resourceCode.value);
  }
}

export class Statement {
  actions = '';
  effect = '';
  resource = '';
  resourceCode = '';
}
