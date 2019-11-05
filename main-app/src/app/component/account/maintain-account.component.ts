import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Option, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';
import { AccountService } from '../../service/account.service';
import { BaseBotComponent } from '../common/baseBot.component';

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

  static checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.passwordCapture.value;
    const confirmPass = group.controls.passwordCaptureReenter.value;
    return pass === confirmPass ? null : { notSame: true };
  }

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
      /*this.notificationService.notifyAny(
        this.accountForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );*/
    }
  }

  private createForm(): void {
    this.accountForm = this.autoGenFormGroup(
      this.accountModel,
      this.validationRules
    );
    this.accountForm.setValidators(MaintainAccountComponent.checkPasswords);
    /**
     * To capture role code we add a custom form control. We capture the code and then convert the code
     * into role object and set that object into the role array.
     */
    const rolesValidationRules = this.findValidatorRuleForProperty(
      this.validationRules,
      'roles'
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

  onSubmit() {
    if (this.accountForm.invalid) {
    } else {
      const finalModel = this.accountForm.value;
      finalModel.owner.contactModes = [];
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
