import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Option} from 'seerlogics-ngui-components';
import {Subscription} from 'rxjs';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {SubscriptionService} from '../../../service/subscription.service';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'seeradmin-maintain-tier',
  templateUrl: './maintainTier.component.html',
  styleUrls: ['./maintainTier.component.css']
})
export class MaintainTierComponent extends BaseBotComponent implements OnInit, OnDestroy {
  tierForm: FormGroup;
  validationRules: any;
  validationRuleSubscription: Subscription;
  tierServiceSubscription: Subscription;
  tierModel: any;
  tierTypeOptions: Option[] = [];
  tierDurationOptions: Option[] = [];

  constructor(injector: Injector, private subscriptionService: SubscriptionService, private router: Router,
              private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add') > -1) {
        this.currentAction = 'add';
        this.initTierModel();
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.initEditTier();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.tierServiceSubscription) {
      this.tierServiceSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.tierForm);

    if (this.tierForm.valid) {
      const finalModel = this.tierForm.value;
      this.subscriptionService.saveTier(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.tierForm = null;
          this.notificationService.notify('Refresh Results!',
            BIZ_BOTS_CONSTANTS.REFRESH_TIER_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_TIER_SEARCH_RESULTS);
        }
      });
    }
  }

  revert() {
    if (this.tierModel) {
      this.tierForm = this.autoGenFormGroup(this.tierModel, this.validationRules);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getResourceLocal(key: string) {
    return this.getResource('subscription', 'tier.' + key);
  }

  private initEditTier() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateTier').subscribe(rules => {
        this.validationRules = rules;
        this.tierServiceSubscription = this.subscriptionService.getTierById(id).subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private initTierModel() {
    this.validationRuleSubscription = this.validationService.getValidationRuleMetadata('validateTier').subscribe(rules => {
      this.validationRules = rules;
      this.tierServiceSubscription = this.subscriptionService.initTierModel().subscribe((model) => {
        this.createForm(model);
      });
    });
  }

  private createForm(model: any) {
    this.tierModel = model;
    this.tierForm = this.autoGenFormGroup(this.tierModel, this.validationRules);

    this.tierTypeOptions = this.buildOptions(this.tierModel.referenceData.tierType);
    this.tierDurationOptions = this.buildOptions(this.tierModel.referenceData.tierDuration);
  }
}
