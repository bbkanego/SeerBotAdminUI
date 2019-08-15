import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonUtilsModule } from 'my-component-library';
import { ActionService } from '../../service/action.service';
import { CategoryService } from '../../service/category.service';
import { PolicyService } from '../../service/policy.service';
import { ResourceService } from '../../service/resource.service';
import { ActionComponent } from './action/action.component';
import { MaintainCategoryComponent } from './maintain-category/maintain-category.component';
import { PolicyComponent } from './policy/policy.component';
import { RefDataRoutingModule } from './refdata-routing.module';
import { ResourceComponent } from './resource/resource.component';
import { SearchActionResultsComponent } from './search-action-results/search-action-results.component';
import { SearchCategoryResultsComponent } from './search-category-results/search-category-results.component';
import { SearchPolicyResultsComponent } from './search-policy-results/search-policy-results.component';
import { SearchResourceResultsComponent } from './search-resource-results/search-resource-results.component';
import { SearchCategoryCriteriaComponent } from './search-category-criteria/search-category-criteria.component';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    CommonUtilsModule, RefDataRoutingModule
  ],
  providers: [CategoryService, ActionService, ResourceService, PolicyService],
  declarations: [MaintainCategoryComponent, SearchCategoryResultsComponent,
    SearchActionResultsComponent, SearchResourceResultsComponent, SearchCategoryCriteriaComponent,
    SearchPolicyResultsComponent, ActionComponent, PolicyComponent, ResourceComponent]
})
export class RefDataModule { }
