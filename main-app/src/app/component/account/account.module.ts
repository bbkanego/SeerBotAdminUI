import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintainAccountComponent } from './maintain-account.component';
import { AccountRoutingModule } from './account-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonUtilsModule } from 'my-component-library';
import {MaintainSubscriptionComponent} from './maintain-subscription.component';

@NgModule({
  declarations: [MaintainAccountComponent, MaintainSubscriptionComponent],
  imports: [CommonModule, CommonUtilsModule, AccountRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [MaintainAccountComponent, MaintainSubscriptionComponent],
  providers: []
})
export class AccountModule {}
