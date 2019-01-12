import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService, NotificationService, SUBSCRIBER_TYPES } from 'my-component-library';
import { Subscription } from 'rxjs/Subscription';

import { BotAuthenticationService } from './service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  showAuthenticatedItems: boolean;
  loginSubscription: Subscription;
  private allBootstrapItemsFetched = false;

  constructor(
    private authenticationService: BotAuthenticationService,
    private notificationService: NotificationService,
    private router: Router,
    private commonService: CommonService
  ) {}

  onActivate(eventObj) {}

  onDeactivate(eventObj) {}

  private loadResources() {
    if (this.isLoggedIn()) {
      this.showAuthenticatedItems = true;
      this.commonService.getMessages();
      this.commonService.getCmsContent();
      this.allBootstrapItemsFetched = true;
    }
  }

  ngOnInit(): void {
    this.showAuthenticatedItems = false;
    this.loadResources();

    // this will be called when the user refreshes the page.
    if (this.isLoggedIn()) {
      this.showAuthenticatedItems = true;
    }

    this.loginSubscription = this.notificationService
      .onNotification()
      .subscribe((data: any) => {
          if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType ||
            SUBSCRIBER_TYPES.LOGOUT_SUCCESS === data.subscriberType) {
            if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType) {
              this.allBootstrapItemsFetched = false;
              this.loadResources();
            }
          } else if (SUBSCRIBER_TYPES.NETWORK_ERROR === data.subscriberType) {
            this.showNetworkErrorDialog(data);
          } else if (SUBSCRIBER_TYPES.FORCE_LOGOUT === data.subscriberType) {
            this.logout();
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
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
