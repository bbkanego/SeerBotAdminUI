import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaintainPlanComponent} from './plan/maintainPlan.component';
import {SearchPlansComponent} from './plan/searchPlans.component';
import {MaintainTierComponent} from './tier/maintainTier.component';
import {SearchTierResultsComponent} from './tier/searchTierResults.component';

const routes: Routes = [
  {path: 'add-tier', component: MaintainTierComponent},
  {
    path: 'search-tier',
    component: SearchTierResultsComponent,
    children: [
      {
        path: 'edit/:id',
        component: MaintainTierComponent
      }
    ]
  },
  {path: 'add-plan', component: MaintainPlanComponent},
  {
    path: 'search-plan',
    component: SearchPlansComponent,
    children: [
      {
        path: 'edit/:id',
        component: MaintainPlanComponent
      }
    ]
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule {

}
