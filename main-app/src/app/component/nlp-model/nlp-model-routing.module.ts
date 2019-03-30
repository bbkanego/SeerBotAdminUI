import { RouterModule, Routes } from '@angular/router';
import { TrainModelComponent } from './train-model/train-model.component';
import { SearchModelComponent } from './search-model/search-model.component';
import { NgModule } from '@angular/core';

const ROUTES: Routes = [
  {
    /**
     * https://angular.io/guide/lazy-loading-ngmodules
     * Notice that the path is set to an empty string. This is because the path in
     * AppRoutingModule is already set to customers, so this route in the CustomersRoutingModule,
     * is already within the customers context. Every route in this routing module is a child route.
     */
    path: '',
    component: TrainModelComponent
  },
  {
    path: 'start-train-model',
    component: TrainModelComponent
  },
  {
    path: 'train-model',
    component: TrainModelComponent
  },
  {
    path: 're-train-model',
    component: TrainModelComponent
  },
  {
    path: 'search-models',
    component: SearchModelComponent,
    children: [
      {
        path: 'delete',
        component: TrainModelComponent
      },
      {
        path: 'view/:id',
        component: TrainModelComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class NlpModelRoutingModule {}
