import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StateMachineComponent} from './model/state-machine-model.component';
import {StateMachineRoutingModule} from './state-machine.routing';
import {StateMachineService} from '../../service/stateMachineModel.service';

@NgModule({
  declarations: [StateMachineComponent],
  imports: [CommonModule, StateMachineRoutingModule],
  exports: [StateMachineComponent],
  providers: [StateMachineService]
})
export class StateMachineModule {
}
