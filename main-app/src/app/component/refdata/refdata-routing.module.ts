import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UberAdminGuard} from '../../guard/uberAdmin.guard';
import {ActionComponent} from './action/action.component';
import {MaintainCategoryComponent} from './maintain-category/maintain-category.component';
import {MaintainRoleComponent} from './maintain-role/maintain-role.component';
import {PolicyComponent} from './policy/policy.component';
import {ResourceComponent} from './resource/resource.component';
import {SearchActionResultsComponent} from './search-action-results/search-action-results.component';
import {SearchCategoryCriteriaComponent} from './search-category-criteria/search-category-criteria.component';
import {SearchCategoryResultsComponent} from './search-category-results/search-category-results.component';
import {SearchPolicyResultsComponent} from './search-policy-results/search-policy-results.component';
import {SearchResourceResultsComponent} from './search-resource-results/search-resource-results.component';
import {SearchRoleResultsComponent} from './search-role-results/search-role-results.component';

const ROUTE: Routes = [
  {path: '', component: SearchCategoryCriteriaComponent},
  {path: 'category/search/init', component: SearchCategoryCriteriaComponent},
  {
    path: 'category/search',
    component: SearchCategoryResultsComponent,
    children: [
      {path: 'edit/:id', component: MaintainCategoryComponent},
      {path: 'delete/init/:id', component: MaintainCategoryComponent},
      {path: 'delete', component: MaintainCategoryComponent},
      {path: 'save', component: MaintainCategoryComponent},
    ]
  },
  {path: 'category/add/init', component: MaintainCategoryComponent},
  {path: 'category/add/save', component: MaintainCategoryComponent},
  {
    path: 'action/search',
    component: SearchActionResultsComponent,
    canActivate: [UberAdminGuard],
    children: [
      {path: 'edit/:id', component: ActionComponent},
      {path: 'delete/init/:id', component: ActionComponent},
      {path: 'delete', component: ActionComponent},
      {path: 'save', component: ActionComponent},
    ]
  },
  {
    path: 'resource/search',
    component: SearchResourceResultsComponent,
    canActivate: [UberAdminGuard],
    children: [
      {path: 'edit/:id', component: ResourceComponent},
      {path: 'delete/init/:id', component: ResourceComponent},
      {path: 'delete', component: ResourceComponent},
      {path: 'save', component: ResourceComponent},
    ]
  },
  {
    path: 'policy/search',
    component: SearchPolicyResultsComponent,
    canActivate: [UberAdminGuard],
    children: [
      {path: 'edit/:id', component: PolicyComponent},
      {path: 'delete/init/:id', component: PolicyComponent},
      {path: 'delete', component: PolicyComponent},
      {path: 'save', component: PolicyComponent}
    ]
  },
  {
    path: 'role/search',
    component: SearchRoleResultsComponent,
    canActivate: [UberAdminGuard],
    children: [
      {path: 'edit/:id', component: MaintainRoleComponent},
      {path: 'delete/init/:id', component: MaintainRoleComponent},
      {path: 'delete', component: MaintainRoleComponent},
      {path: 'save', component: MaintainRoleComponent}
    ]
  },
  {path: 'resource/add/init', component: ResourceComponent, canActivate: [UberAdminGuard]},
  {path: 'resource/add/save', component: ResourceComponent, canActivate: [UberAdminGuard]},
  {path: 'resource/add/edit', component: ResourceComponent, canActivate: [UberAdminGuard]},
  {path: 'action/add/init', component: ActionComponent, canActivate: [UberAdminGuard]},
  {path: 'action/add/save', component: ActionComponent, canActivate: [UberAdminGuard]},
  {path: 'action/add/edit', component: ActionComponent, canActivate: [UberAdminGuard]},
  {path: 'policy/add/init', component: PolicyComponent, canActivate: [UberAdminGuard]},
  {path: 'policy/add/save', component: PolicyComponent, canActivate: [UberAdminGuard]},
  {path: 'policy/add/edit', component: PolicyComponent, canActivate: [UberAdminGuard]},
  {path: 'role/add/init', component: MaintainRoleComponent, canActivate: [UberAdminGuard]},
  {path: 'role/add/save', component: MaintainRoleComponent, canActivate: [UberAdminGuard]},
  {path: 'role/add/edit', component: MaintainRoleComponent, canActivate: [UberAdminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(ROUTE)],
  exports: [RouterModule]
})
export class RefDataRoutingModule {
}

