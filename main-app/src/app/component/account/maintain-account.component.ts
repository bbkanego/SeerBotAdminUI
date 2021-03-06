import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Option, SUBSCRIBER_TYPES} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {AccountService} from '../../service/account.service';
import {BaseBotComponent} from '../common/baseBot.component';
import * as $ from 'jquery';

@Component({
  selector: 'seeradmin-maintain-acct',
  templateUrl: './maintain-account.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./maintain-account.component.css']
})
export class MaintainAccountComponent extends BaseBotComponent
  implements OnInit, OnDestroy {
  accountDetailForm: FormGroup;
  accountForm: FormGroup;
  accountOwner: FormGroup;
  contactModes: FormArray;
  currentAction = 'add';
  accountModel;
  validationRules: any;
  roles: Option[];
  plans: Option[];
  validationRuleSubscription: Subscription;
  planDetailsObj: any = {};

  @ViewChild('wellBronze') wellBronze: ElementRef;
  @ViewChild('wellPlatinum') wellPlatinum: ElementRef;
  @ViewChild('wellGold') wellGold: ElementRef;
  @ViewChild('wellSilver') wellSilver: ElementRef;

  constructor(
    injector: Injector,
    private router: Router,
    private accountService: AccountService
  ) {
    super(injector);
  }

  static checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.passwordCapture.value;
    const confirmPass = group.controls.passwordCaptureReenter.value;
    return pass === confirmPass ? null : {notSame: true};
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

  selectPlan(planCode: string, event) {
    $('.well').removeClass('well-selected').addClass('well-unselected');
    $('button.selectPlanButton').text('Select Plan').removeClass('selectedPlanButton')
      .removeClass('btn-lg').removeClass('active').addClass('btn-success');
    const buttonObj = $(event.target);
    buttonObj.text('Selected').addClass('selectedPlanButton').removeClass('btn-success')
      .addClass('btn-lg');
    buttonObj.parents('.well').addClass('well-selected').removeClass('well-unselected');
    this.accountDetailForm.get('membershipPlanCode').setValue(planCode);
  }

  getResourceLocal(key: string): string {
    return this.getResource('maintainAccount', key);
  }

  getSubscriptionLabels(key: string): string {
    return this.getResource('subscription', key);
  }

  onSubmit() {
    if (this.accountDetailForm.invalid) {
    } else {
      const finalModel = this.accountDetailForm.value;
      finalModel.account.owner.contactModes = [];
      this.accountService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/login']);
        } else {
          // take action when editing the account.
        }
      });
    }
  }

  getMembershipPlan(membershipPlanCode: string) {
    const selectedPlan = this.accountModel.referenceData.plans
      .filter(plan => plan.code === membershipPlanCode);
    return selectedPlan[0];
  }

  onPlanSelect(event) {
    const membershipPlanCode = event.target.value;
    // this.accountDetailForm.get('membershipPlanCode').setValue(this.accountDetailForm.value.membershipPlanCode);
    const selectedPlan = this.accountModel.referenceData.plans
      .filter(plan => plan.code === membershipPlanCode);

    if (selectedPlan.length > 0) {
      this.planDetailsObj = selectedPlan[0];
    } else {
      this.planDetailsObj = {};
    }

  }

  private createForm(): void {
    this.accountDetailForm = this.autoGenFormGroup(
      this.accountModel,
      this.validationRules
    );
    this.accountForm = this.accountDetailForm.get('account') as FormGroup;
    this.accountForm.setValidators(MaintainAccountComponent.checkPasswords);
    this.accountOwner = this.accountForm.get('owner') as FormGroup;
    this.contactModes = this.accountOwner.get('contactModes') as FormArray;

    this.plans = this.buildOptions(this.accountModel.referenceData.plans);
  }

  private initComponent(): void {
    if (this.currentAction === 'edit') {
      this.createForm();
    } else {
      this.createForm();
    }

    // this.roles = this.buildOptions(this.accountModel.referenceData.roles);

    if (this.currentAction === 'edit') {
      this.notificationService.notifyAny(
        this.accountForm,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET
      );
    }
  }
}
