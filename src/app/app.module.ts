import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonUtilsModule, NotificationService, ValidationService, AuthenticationService, CommonService} from 'my-component-library';
import { DashboardModule } from './component/dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { CommonComponentModule } from './component/common/commonComp.module';
import { IntentService } from './service/intent.service';
import { AuthenticationModule } from './component/authentication/authentication.module';
import { BotAuthenticationService } from './service/authentication.service';
import { AuthGuard } from './guard/auth.guard';
import { LogoutGuard } from './guard/logout.guard';
import { environment } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, CommonComponentModule, CommonUtilsModule, DashboardModule,
    AppRoutingModule, AuthenticationModule
  ],
  providers: [NotificationService, BotAuthenticationService, AuthenticationService,
    CommonService, IntentService, ValidationService, AuthGuard, LogoutGuard,
    {provide: 'environment', useValue: environment}],
  bootstrap: [AppComponent]
})
export class AppModule { }
