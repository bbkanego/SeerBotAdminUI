import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import {BotAuthenticationService} from '../../service/authentication.service';
import {NotificationService, Login} from 'my-component-library';
import {SUBSCRIBER_TYPES} from 'my-component-library';

@Component({
  'selector': 'app-bkauthenticate',
  'templateUrl': './authentication.component.html'
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  loginModel: Login;
  loginFailed = false;
  logoutSuccess = false;
  private sub: any;

  constructor(private authenticationService: BotAuthenticationService,
              private router: Router, private notificationService: NotificationService) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.loginModel = new Login();
    this.sub = this.notificationService.onNotification().subscribe(
      (data: any) => {
        if (SUBSCRIBER_TYPES.LOGIN_SUCCESS === data.subscriberType) {
          this.router.navigate(['/dashboard']);
        } else if (SUBSCRIBER_TYPES.LOGIN_FAILED === data.subscriberType) {
          this.loginFailed = true;
          setTimeout(() => {
            this.loginFailed = false;
          }, 2000);
        } else if (SUBSCRIBER_TYPES.LOGOUT_SUCCESS === data.subscriberType) {
          this.logoutSuccess = true;
          setTimeout(() => {
            this.logoutSuccess = false;
          }, 2000);
        }
      }, error => console.log(error)
    );
  }

  login(): void {
    this.authenticationService.login(this.loginModel);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  signUp(): void {
    this.router.navigate(['/account/signup']);
  }
}