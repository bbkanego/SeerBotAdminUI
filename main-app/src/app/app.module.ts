import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  AuthenticationService,
  CommonService,
  CommonUtilsModule,
  NotificationService,
  ValidationService
} from 'my-component-library';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AccountModule} from './component/account/account.module';
import {AuthenticationModule} from './component/authentication/authentication.module';
import {CommonComponentModule} from './component/common/commonComp.module';
import {DashboardModule} from './component/dashboard/dashboard.module';
import {StripeGWModule} from './component/stripe/stripe-gw.module';
import {environment} from './environments/frozenEnvironment';
import {AuthGuard} from './guard/auth.guard';
import {LogoutGuard} from './guard/logout.guard';
import {AccountService} from './service/account.service';
import {BotAuthenticationService} from './service/authentication.service';
import {IntentService} from './service/intent.service';
import {UberAdminGuard} from './guard/uberAdmin.guard';
import {RoleService} from './service/role.service';
import {DashboardService} from './service/dashboard.service';
import {SubscriptionService} from './service/subscription.service';
import {HelpComponent} from './component/help/help.component';
import {HelpModule} from './component/help/help.module';
import {BotAdminCommonService} from './service/common.service';
import {InterceptHttpInterceptor} from './interceptor/httpconfig.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NoCacheHeadersInterceptor} from './interceptor/noCacheHeader.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, CommonComponentModule, CommonUtilsModule, DashboardModule,
    AppRoutingModule, AuthenticationModule, StripeGWModule, HttpClientModule,
    BrowserAnimationsModule, AccountModule, HelpModule
  ],
  providers: [NotificationService, BotAuthenticationService, AuthenticationService,
    CommonService, BotAdminCommonService, IntentService, ValidationService, RoleService, DashboardService,
    AuthGuard, LogoutGuard, UberAdminGuard, AccountService, SubscriptionService,
    {provide: 'environment', useValue: environment},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptHttpInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: NoCacheHeadersInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [HelpComponent]
})
export class AppModule {
}
