

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintainCategoryComponent } from './maintain-category/maintain-category.component';
import { SearchCategoryCriteriaComponent } from './search-category-criteria/search-category-criteria.component';
import { SearchCategoryResultsComponent } from './search-category-results/search-category-results.component';

const ROUTE: Routes = [
    { path: '', component: SearchCategoryCriteriaComponent },
    { path: 'category/search/init', component: SearchCategoryCriteriaComponent },
    {
        path: 'category/search',
        component: SearchCategoryResultsComponent,
        children: [
            { path: 'edit/:id', component: MaintainCategoryComponent },
            { path: 'delete/init/:id', component: MaintainCategoryComponent },
            { path: 'delete', component: MaintainCategoryComponent },
            { path: 'save', component: MaintainCategoryComponent },
        ]
    },
    { path: 'category/init', component: MaintainCategoryComponent },
    { path: 'category/save', component: MaintainCategoryComponent }
];

@NgModule({
    imports: [RouterModule.forChild(ROUTE)],
    exports: [RouterModule]
})
export class RefDataRoutingModule {
}

