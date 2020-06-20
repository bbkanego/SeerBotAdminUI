import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StateMachineComponent} from './model/state-machine-model.component';

const routes: Routes = [
  {path: '', component: StateMachineComponent},
  {path: 'model', component: StateMachineComponent},
  {path: '**', component: StateMachineComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateMachineRoutingModule {
}
