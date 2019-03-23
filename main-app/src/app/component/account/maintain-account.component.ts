import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { AccountService } from '../../service/account.service';
import { BaseBotComponent } from '../common/baseBot.component';
import {
  Option,
  SUBSCRIBER_TYPES,
  CustomFormControl
} from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-maintain-acct',
  templateUrl: './maintain-account.component.html',
  styleUrls: ['./maintain-account.component.css']
})
export class MaintainAccountComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  accountForm: FormGroup;
  accountOwner: FormGroup;
  contactModes: FormArray;
  currentAction = 'add';
  accountModel;
  validationRules: any;
  roles: Option[];
  validationRuleSubscription: Subscription;

  constructor(
    injector: Injector,
    private router: Router,
    private accountService: AccountService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.commonService.getCmsContent();
    this.commonService.getMessages();
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateAccountRule')
      .subscribe(rules => {
        this.validationRules = rules;
        this.accountService.initModelByType('person').subscribe(model => {
          this.accountModel = model;
          this.initComponent();
        });
      });
  }

  getSubmitButtonLabel() {
    if (this.currentAction === 'add') {
      return this.getResourceLocal('createAccount');
    } else {
      return this.getResourceLocal('updateAccount');
    }
  }

  ngOnDestroy() {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
  }

  cancel() {
    if (this.currentAction === 'add') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/dashboard']);
    }
    this.accountForm = null;
  }

  revert() {
    if (this.accountModel) {
      this.createForm();
      this.notificationService.notifyAny(
        this.accountForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }

  private createForm(): void {
    this.accountForm = this.autoGenFormGroup(
      this.accountModel,
      this.validationRules
    );
    /**
     * To capture role code we add a custom form control. We capture the code and then convert the code
     * into role object and set that object into the role array.
     */
    const rolesValidationRules = this.findValidatorRuleForProperty(
      this.validationRules,
      'roles'
    );
    this.accountForm.addControl(
      'roleCode',
      new CustomFormControl(
        '',
        this.createValidatorRuleForProperty('roles', rolesValidationRules)
      )
    );
    this.accountOwner = this.accountForm.get('owner') as FormGroup;
    this.contactModes = this.accountOwner.get('contactModes') as FormArray;
  }

  private initComponent(): void {
    if (this.currentAction === 'edit') {
      this.createForm();
    } else {
      this.createForm();
    }

    this.roles = this.buildOptions(this.accountModel.referenceData.roles);

    if (this.currentAction === 'edit') {
      this.notificationService.notifyAny(
        this.accountForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }

  getResourceLocal(key: string): string {
    return this.getResource('maintainAccount', key);
  }

  onSubmit(event) {
    if (this.accountForm.invalid) {
    } else {
      const roleCode = this.accountForm.get('roleCode').value;
      if (roleCode) {
        const matchingRole = this.accountModel.referenceData.roles.filter(
          role => role.code === roleCode
        );
        const finalModel = this.accountForm.value;
        finalModel.roles = [];
        finalModel.roles.push(matchingRole[0]);
        this.accountService.save(finalModel).subscribe(res => {
          if (this.currentAction === 'add') {
            this.router.navigate(['/login']);
          } else {
            // take action when editing the account.
          }
        });
      }
    }
  }
}
