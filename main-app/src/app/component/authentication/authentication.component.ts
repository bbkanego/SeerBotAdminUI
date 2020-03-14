import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BotAuthenticationService} from '../../service/authentication.service';
import {Login, SUBSCRIBER_TYPES} from 'my-component-library';
import {BaseBotComponent} from '../common/baseBot.component';

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

  createAccount(): void {
    this.router.navigate(['/account/init-signup']);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  signUp(): void {
    this.router.navigate(['/account/signup']);
  }
}
