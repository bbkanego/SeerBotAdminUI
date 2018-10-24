import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CommonUtilsModule, NotificationService, AuthenticationService, CommonService} from 'my-component-library';
import { DashboardModule } from './dashboard/dashboard.module';
import { HttpModule } from '@angular/http';
import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, CommonUtilsModule, DashboardModule, HttpModule
  ],
  providers: [NotificationService, AuthenticationService, CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
