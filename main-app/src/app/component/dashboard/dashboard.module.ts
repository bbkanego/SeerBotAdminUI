import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {ButtonModule, ChartModule, DataTableModule, InputModule} from 'seerlogics-ngui-components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, ButtonModule, InputModule, DataTableModule, ChartModule,
    ReactiveFormsModule, FormsModule
  ],
  exports: [DashboardComponent],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
