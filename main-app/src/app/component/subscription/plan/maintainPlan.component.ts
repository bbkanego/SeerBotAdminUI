import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Option } from 'my-component-library';
import { Subscription } from 'rxjs';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { SubscriptionService } from '../../../service/subscription.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
    selector: 'app-maintain-plan',
    templateUrl: './maintainPlan.component.html',
    styleUrls: ['./maintainPlan.component.css']
})
export class MaintainPlanComponent extends BaseBotComponent implements OnInit, OnDestroy {
    planForm: FormGroup;
    validationRules: any;
    validationRuleSubscription: Subscription;
    planServiceSubscription: Subscription;
    planModel: any;
    tiersOptions: Option[] = [];

    constructor(injector: Injector, private subscriptionService: SubscriptionService, private router: Router,
        private activatedRoute: ActivatedRoute) {
        super(injector);
    }

    ngOnInit() {
        this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
            const path = urlSegment.join('/');
            if (path.indexOf('add') > -1) {
                this.currentAction = 'add';
                this.initPlanModel();
                this.enableBackButton();
            } else if (path.indexOf('edit') > -1) {
                this.currentAction = 'edit';
                this.initEditPlan();
            }
        });
    }

    private initEditPlan() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.validationRuleSubscription = this.validationService
            .getValidationRuleMetadata('validateSubscriptionPlan').subscribe(rules => {
                this.validationRules = rules;
                this.planServiceSubscription = this.subscriptionService.getPlanById(id).subscribe((model) => {
                    this.createForm(model);
                });
            });
    }

    private initPlanModel() {
        this.validationRuleSubscription = this.validationService.
            getValidationRuleMetadata('validateSubscriptionPlan').subscribe(rules => {
                this.validationRules = rules;
                this.planServiceSubscription = this.subscriptionService.initPlanModel().subscribe((model) => {
                    this.createForm(model);
                });
            });
    }

    private createForm(model: any) {
        this.planModel = model;
        this.tiersOptions = this.buildOptions(this.planModel.referenceData.tiers);
        this.planForm = this.autoGenFormGroup(this.planModel, this.validationRules);
    }

    ngOnDestroy(): void {
        if (this.validationRuleSubscription) {
            this.validationRuleSubscription.unsubscribe();
        }
        if (this.planServiceSubscription) {
            this.planServiceSubscription.unsubscribe();
        }
    }

    onSubmit() {
        this.markFormGroupTouched(this.planForm);

        if (this.planForm.valid) {
            const finalModel = this.planForm.value;
            this.subscriptionService.savePlan(finalModel).subscribe(res => {
                if (this.currentAction === 'add') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.planForm = null;
                    this.notificationService.notify('Refresh Results!',
                        BIZ_BOTS_CONSTANTS.REFRESH_SUBSCRIPTION_SEARCH_RESULTS,
                        BIZ_BOTS_CONSTANTS.REFRESH_SUBSCRIPTION_SEARCH_RESULTS);
                }
            });
        }
    }

    revert() {
        if (this.planModel) {
            this.planForm = this.autoGenFormGroup(this.planModel, this.validationRules);
        }
    }

    cancel() {
        this.router.navigate(['/dashboard']);
    }

    getResourceLocal(key: string) {
        return this.getResource('subscription', 'plan.' + key);
    }
}
