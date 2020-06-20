import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule, InputModule} from 'seerlogics-ngui-components';

import {AuthenticationComponent} from './authentication.component';

@NgModule({
  imports: [FormsModule, CommonModule, ButtonModule, InputModule],
  declarations: [AuthenticationComponent],
  exports: [AuthenticationComponent]
})
export class AuthenticationModule {

}
