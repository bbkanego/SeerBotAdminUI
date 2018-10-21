import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { CommonUtilsModule } from 'my-component-library';

@NgModule({
  imports: [
    CommonModule, CommonUtilsModule
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
