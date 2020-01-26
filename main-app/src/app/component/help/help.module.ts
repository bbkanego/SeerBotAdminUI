import {Component, NgModule, OnDestroy, OnInit} from '@angular/core';
import {MaintainAccountComponent} from '../account/maintain-account.component';
import {CommonModule} from '@angular/common';
import {CommonUtilsModule} from 'my-component-library';
import {AccountRoutingModule} from '../account/account-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HelpComponent} from './help.component';
import {HelpRoutingModule} from './help-routing.module';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, CommonUtilsModule, HelpRoutingModule],
  exports: [HelpComponent],
  providers: []
})
export class HelpModule {}
