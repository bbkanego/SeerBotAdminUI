import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {CustomFormControl} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {RoleService} from '../../../service/role.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'app-maintain-role',
  templateUrl: './maintain-role.component.html',
  styleUrls: ['./maintain-role.component.css']
})
export class MaintainRoleComponent extends BaseBotComponent implements OnInit, OnDestroy {

  roleForm: FormGroup;
  validationRules: any;
  validationRuleSubscription: Subscription;
  botServiceSubscription: Subscription;
  roleModel: any;
  currentAction: string;
  policyOptions: any[];
  multiSelectStartValues: any[] = [];

  constructor(injector: Injector, private roleService: RoleService, private router: Router,
              private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  getStartingValues(): string[] {
    return this.multiSelectStartValues ? this.multiSelectStartValues : null;
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add') > -1) {
        this.currentAction = 'add';
        this.initRoleModel();
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.initEditRole();
      }
    });
  }

  processSelectedValues(policyCodes) {
    this.setPoliciesInModel(policyCodes, this.roleModel);
  }

  setPoliciesInModel(policyCodes, roleModel) {
    // const statements: FormControl = this.policyForm.get('statements') as FormControl;
    const allPolicies: any[] = roleModel.referenceData['policies'];
    policyCodes.forEach((value) => {
      allPolicies.forEach((policy) => {
        if (policy.code === value) {
          roleModel.policies.push(policy);
        }
      });
    });
    console.log(policyCodes.join());
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.roleForm);

    if (this.roleForm.valid) {
      const finalModel = this.roleForm.value;
      const selectedPolicies = this.roleForm.get('selectPolicies').value;
      this.setPoliciesInModel(selectedPolicies.split(','), finalModel);
      this.roleService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.roleForm = null;
          this.roleModel = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_ROLE_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_ROLE_SEARCH_RESULTS);
        }
      });
    }
  }

  revert() {
    if (this.roleModel) {
      this.roleForm = this.autoGenFormGroup(this.roleModel, this.validationRules);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getResourceLocal(key: string) {
    return this.getResource('refData', key);
  }

  private initEditRole() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateRoleRule').subscribe(rules => {
        this.validationRules = rules;
        this.botServiceSubscription = this.roleService.getById(id).subscribe((model) => {
          this.createForm(model);
        });
      });
    /* this.roleModel.policies.forEach((policy) => {
      this.multiSelectStartValues.push(policy.code);
    }); */
  }

  private addSelectPolicy() {
    const policiesControl = new CustomFormControl(null, Validators.required);
    policiesControl.validationRules['required'] = true;
    this.roleForm.addControl('selectPolicies', policiesControl);
  }

  private initRoleModel() {
    this.validationRuleSubscription = this.validationService.getValidationRuleMetadata('validateRoleRule').subscribe(rules => {
      this.validationRules = rules;
      this.botServiceSubscription = this.roleService.initModel().subscribe((model) => {
        this.createForm(model);
      });
    });
  }

  private createForm(model: any) {
    this.multiSelectStartValues = [];
    this.roleModel = model;
    this.roleForm = this.autoGenFormGroup(this.roleModel, this.validationRules);
    this.addSelectPolicy();
    this.policyOptions = this.buildOptions(this.roleModel.referenceData['policies']);

    this.roleModel.policies.forEach((policy) => {
      this.multiSelectStartValues.push({value: policy.code, label: policy.name});
    });
  }

}
