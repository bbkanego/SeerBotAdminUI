import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintainAccountComponent } from './maintain-account.component';
import { AccountRoutingModule } from './account-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonUtilsModule } from 'my-component-library';

@NgModule({
  declarations: [MaintainAccountComponent],
  imports: [CommonModule, CommonUtilsModule, AccountRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [MaintainAccountComponent],
  providers: []
})
export class AccountModule {}
