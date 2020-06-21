import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ButtonModule, DataTableModule, InputModule, SelectorModule, TextareaModule} from 'seerlogics-ngui-components';
import {SubscriptionRoutingModule} from './subscription-router.module';
import {MaintainTierComponent} from './tier/maintainTier.component';
import {SearchTierResultsComponent} from './tier/searchTierResults.component';
import {SubscriptionService} from '../../service/subscription.service';
import {MaintainPlanComponent} from './plan/maintainPlan.component';
import {SearchPlansComponent} from './plan/searchPlans.component';

@NgModule({
  declarations: [MaintainTierComponent, MaintainPlanComponent,
    SearchTierResultsComponent, SearchPlansComponent],
  imports: [CommonModule, SubscriptionRoutingModule, ReactiveFormsModule,
    RouterModule, ButtonModule, InputModule, DataTableModule, TextareaModule, SelectorModule],
  exports: [],
  providers: [SubscriptionService],
})
export class SubscriptionModule {
}
