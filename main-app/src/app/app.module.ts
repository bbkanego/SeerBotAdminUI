import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService, CommonService, CommonUtilsModule, NotificationService, ValidationService } from 'my-component-library';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountModule } from './component/account/account.module';
import { AuthenticationModule } from './component/authentication/authentication.module';
import { CommonComponentModule } from './component/common/commonComp.module';
import { DashboardModule } from './component/dashboard/dashboard.module';
import { StripeGWModule } from './component/stripe/stripe-gw.module';
import { environment } from './environments/frozenEnvironment';
import { AuthGuard } from './guard/auth.guard';
import { LogoutGuard } from './guard/logout.guard';
import { AccountService } from './service/account.service';
import { BotAuthenticationService } from './service/authentication.service';
import { IntentService } from './service/intent.service';
import { UberAdminGuard } from './guard/uberAdmin.guard';
import { RoleService } from './service/role.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, CommonComponentModule, CommonUtilsModule, DashboardModule,
    AppRoutingModule, AuthenticationModule, StripeGWModule,
    BrowserAnimationsModule, AccountModule
  ],
  providers: [NotificationService, BotAuthenticationService, AuthenticationService,
    CommonService, IntentService, ValidationService, RoleService,
    AuthGuard, LogoutGuard, UberAdminGuard, AccountService,
    { provide: 'environment', useValue: environment }],
  bootstrap: [AppComponent]
})
export class AppModule { }
