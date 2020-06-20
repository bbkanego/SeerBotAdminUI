import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintainAccountComponent} from './maintain-account.component';
import {AccountRoutingModule} from './account-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ButtonModule, InputModule} from 'seerlogics-ngui-components';
import {MaintainSubscriptionComponent} from './maintain-subscription.component';

@NgModule({
  declarations: [MaintainAccountComponent, MaintainSubscriptionComponent],
  imports: [CommonModule, ButtonModule, InputModule, AccountRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [MaintainAccountComponent, MaintainSubscriptionComponent],
  providers: []
})
export class AccountModule {
}
