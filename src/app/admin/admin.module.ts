import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { CommonUtilsModule } from 'my-component-library';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, CommonUtilsModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
