import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService, ModalComponent, Notification, NotificationService, SUBSCRIBER_TYPES} from 'my-component-library';
import {Subscription} from 'rxjs/Subscription';

import {BotAuthenticationService} from './service/authentication.service';
import {BIZ_BOTS_CONSTANTS} from './model/Constants';
import {BotAdminCommonService} from './service/common.service';

export interface CommonModalModel {
  header: string;
  bodyMessage: string;
  buttonOk: string;
}

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

  customModalData: CommonModalModel = {header: '', bodyMessage: '', buttonOk: ''};

  @ViewChild('commonAppModal') commonAppModal: ModalComponent;
  private showCommonModalSubscription: Subscription;

  constructor(
    private authenticationService: BotAuthenticationService,
    private botAdminCommonService: BotAdminCommonService,
    private notificationService: NotificationService,
    private router: Router,
    private commonService: CommonService
  ) {
  }

  onActivate(eventObj) {
  }

  onDeactivate(eventObj) {
  }

  private showCustomModal(modalData: CommonModalModel) {
    this.customModalData = modalData;
    this.commonAppModal.show();
  }

  private loadResources() {
    this.commonService.getCmsContent();
    if (this.isLoggedIn()) {
      this.showAuthenticatedItems = true;
      this.commonService.getMessages();
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
      .subscribe((data: Notification) => {
          if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType) {
            if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType) {
              this.allBootstrapItemsFetched = false;
              this.loadResources();
            }
          } else if (SUBSCRIBER_TYPES.NETWORK_ERROR === data.subscriberType) {
            this.showNetworkErrorDialog(data);
          } else if (SUBSCRIBER_TYPES.FORCE_LOGOUT === data.subscriberType) {
            this.logout();
          } else if (BIZ_BOTS_CONSTANTS.SHOW_COMMON_MODEL === data.subscriberType) {
            const modalData = data.message as CommonModalModel;
            this.showCustomModal(modalData);
          } else if (SUBSCRIBER_TYPES.ERROR_500 === data.subscriberType) {
            this.showError500ErrorDialog(data);
          }
        },
        error => console.log(error)
      );

    this.showCommonModalSubscription = this.notificationService.onNotification()
      .subscribe((data: Notification) => {

      });
  }

  showNetworkErrorDialog(error) {
    const commonModalModel: CommonModalModel = {
      header: 'Network Error',
      bodyMessage: 'There was a problem connecting to the server. Please try later.', buttonOk: 'OK'
    };
    this.botAdminCommonService.showCommonModal(commonModalModel);
  }

  showError500ErrorDialog(data) {
    const commonModalModel: CommonModalModel = {
      header: 'Something Went Wrong',
      bodyMessage: data.message.errorMessage || data.message.message, buttonOk: 'OK'
    };
    this.botAdminCommonService.showCommonModal(commonModalModel);
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
