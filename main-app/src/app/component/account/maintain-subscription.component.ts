import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Option} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {BaseBotComponent} from '../common/baseBot.component';
import {SubscriptionService} from '../../service/subscription.service';
import {BotAuthenticationService} from '../../service/authentication.service';
import {SeerBotAdminAccount} from '../../model/models';
import {FormGroup} from '@angular/forms';

export interface ChangePassword {
  passwordCapture: string;
  passwordCaptureReenter: string;
  userName?: string;
}


@Component({
  selector: 'app-maintain-subscription',
  templateUrl: './maintain-subscription.component.html',
  styleUrls: ['./maintain-subscription.component.css']
})
export class MaintainSubscriptionComponent extends BaseBotComponent implements OnInit, OnDestroy {

  seerBotAdminAccount: SeerBotAdminAccount;
  subscription;

  category: Option[] = [];
  botServiceSubscription: Subscription;
  showChangePassword = true;
  passwordChangeSuccess = false;
  changePasswordForm: FormGroup;
  showPasswordError = false;
  private validationRuleSubscription: Subscription;
  private validationRules: any;
  @ViewChild('passwordCaptureReenter')
  private passwordCaptureReenter: ElementRef;
  @ViewChild('passwordCapture')
  private passwordCapture: ElementRef;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute,
              private authenticationService: BotAuthenticationService,
              private subscriptionService: SubscriptionService, private router: Router) {
    super(injector);
  }

  static checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.passwordCapture.value;
    const confirmPass = group.controls.passwordCaptureReenter.value;
    return pass === confirmPass ? null : {notSame: true};
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('view-subscription') > -1) {
        this.loadSubscription(path);
        this.enableBackButton();
        this.createChangePasswordForm();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
  }

  cancel() {
    if (this.currentAction === 'add') {
      this.router.navigate(['/dashboard']);
    }
  }

  getResourceLocal(key) {
    return this.getResource('maintainAccount', key);
  }

  showChangePasswordWidgets() {
    this.showChangePassword = false;
    this.createForm();
  }

  createChangePasswordForm() {
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateChangePassword').subscribe(rules => {
        this.validationRules = rules;
        this.createForm();
      });
  }

  cancelChangePassword() {
    this.showChangePassword = true;
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const changePasswordForm: ChangePassword = this.changePasswordForm.value;
      const account: SeerBotAdminAccount = this.authenticationService.getCurrentUserObject();
      changePasswordForm.userName = account.userName;
      this.subscriptionService.changePassword(changePasswordForm).subscribe(res => {
        if (res.success) {
          this.passwordChangeSuccess = true;
          setTimeout(() => {
            this.passwordChangeSuccess = false;
          }, 10000);
        }
      });
    }
  }

  private loadSubscription(path) {
    this.currentAction = 'add';
    const account: SeerBotAdminAccount = this.authenticationService.getCurrentUserObject();
    this.botServiceSubscription = this.subscriptionService.getByUserName(account.userName).subscribe((model) => {
      this.seerBotAdminAccount = model.subscription.owner;
      this.subscription = model.subscription;
    });
  }

  private createForm() {
    const account: SeerBotAdminAccount = this.authenticationService.getCurrentUserObject();
    const changePasswordModel: ChangePassword = {
      passwordCapture: null,
      passwordCaptureReenter: null, userName: account.userName
    };
    this.changePasswordForm = this.autoGenFormGroup(changePasswordModel, this.validationRules);
    this.changePasswordForm.setValidators(MaintainSubscriptionComponent.checkPasswords);
  }
}
