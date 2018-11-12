import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, NotificationService, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { BotAuthenticationService } from './service/authentication.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";
  showAuthenticatedItems: boolean;
  loginSubscription: Subscription;

  constructor(
    private authenticationService: BotAuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private commonService: CommonService
  ) {}

  onActivate(eventObj) {}

  onDeactivate(eventObj) {}

  ngOnInit(): void {
    this.showAuthenticatedItems = false;
    this.loginSubscription = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
          if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType ||
            SUBSCRIBER_TYPES.LOGOUT_SUCCESS === data.subscriberType) {
            if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType) {
              this.commonService.getMessages();
              this.showAuthenticatedItems = true;
            }
          } else if (SUBSCRIBER_TYPES.NETWORK_ERROR === data.subscriberType) {
            this.showNetworkErrorDialog(data);
          }
        },
        error => console.log(error)
      );
  }

  showNetworkErrorDialog(error) {
    // this.networkErrorDialog.visible = true;
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
