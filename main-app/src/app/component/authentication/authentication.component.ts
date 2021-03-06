import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BotAuthenticationService} from '../../service/authentication.service';
import {Login, SUBSCRIBER_TYPES} from 'seerlogics-ngui-components';
import {BaseBotComponent} from '../common/baseBot.component';

// instead of getting the labels from the server, put them here in case of network error
const LoginLabels = {
  heading: 'Login to SeerGab', logoutSuccess: 'Logout Success!',
  loginFailure: 'Login failed! Username/Password not found', copyright: '2020 SeerSense, LLC'
};

@Component({
  'selector': 'app-bkauthenticate',
  'styleUrls': ['./authentication.component.css'],
  'templateUrl': './authentication.component.html'
})
export class AuthenticationComponent extends BaseBotComponent implements OnInit, OnDestroy {
  loginModel: Login;
  loginFailed = false;
  logoutSuccess = false;
  private sub: any;

  constructor(private injector: Injector, private router: Router,
              private authenticationService: BotAuthenticationService) {
    super(injector);
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
        } else if (SUBSCRIBER_TYPES.LOGIN_FAILED === data.subscriberType
          || SUBSCRIBER_TYPES.FORCE_LOGOUT === data.subscriberType) {
          this.loginFailed = true;
          setTimeout(() => {
            this.loginFailed = false;
          }, 4000);
        } else if (SUBSCRIBER_TYPES.LOGOUT_SUCCESS === data.subscriberType) {
          this.logoutSuccess = true;
          setTimeout(() => {
            this.logoutSuccess = false;
          }, 4000);
        }
      }, error => console.log(error)
    );
  }

  login(): void {
    this.authenticationService.login(this.loginModel);
  }

  createAccount(): void {
    this.router.navigate(['/account/init-signup']);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  signUp(): void {
    this.router.navigate(['/account/signup']);
  }

  getCommonResourcesLocal(key) {
    return LoginLabels[key];
  }
}
