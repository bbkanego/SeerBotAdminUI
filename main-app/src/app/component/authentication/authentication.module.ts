import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonUtilsModule } from 'my-component-library';

import { AuthenticationComponent } from './authentication.component';

@NgModule({
  imports: [FormsModule, CommonModule, CommonUtilsModule],
  declarations: [AuthenticationComponent],
  exports: [AuthenticationComponent]
})
export class AuthenticationModule {

}
