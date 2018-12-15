import {NgModel} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {TrainModelComponent} from './train-model/train-model.component';
import {SearchModelComponent} from './search-model/search-model.component';

const ROUTES: Routes = [
  {
    path: 'start-train-model',
    component: TrainModelComponent
  },
  {
    path: 'train-model',
    component: TrainModelComponent
  },
  {
    path: 'search-models',
    component: SearchModelComponent,
    children: [
      {
        path: 'delete',
        component: SearchModelComponent
      }
    ]
  }

];

@NgModel({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class NlpModelRoutingModule {

}
