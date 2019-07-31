import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonUtilsModule } from 'my-component-library';
import { CategoryService } from '../../service/category.service';
import { MaintainCategoryComponent } from './maintain-category/maintain-category.component';
import { RefDataRoutingModule } from './refdata-routing.module';
import { SearchCategoryCriteriaComponent } from './search-category-criteria/search-category-criteria.component';
import { SearchCategoryResultsComponent } from './search-category-results/search-category-results.component';

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, 
    CommonUtilsModule, RefDataRoutingModule
  ],
  providers: [CategoryService],
  declarations: [MaintainCategoryComponent, SearchCategoryCriteriaComponent, SearchCategoryResultsComponent]
})
export class RefDataModule { }
