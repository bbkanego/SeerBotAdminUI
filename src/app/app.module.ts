import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonUtilsModule, NotificationService, AuthenticationService, CommonService} from 'my-component-library';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { CommonComponentModule } from './common/commonComp.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, CommonComponentModule, CommonUtilsModule, DashboardModule, AppRoutingModule
  ],
  providers: [NotificationService, AuthenticationService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
