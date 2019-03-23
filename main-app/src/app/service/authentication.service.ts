import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import { Headers, Http, Response } from '@angular/http';
import { Login, NotificationService, SUBSCRIBER_TYPES, COMMON_CONST, HttpClient } from 'my-component-library';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BotAuthenticationService {

  constructor(private httpClient: HttpClient, private notificationService: NotificationService) {

  }

  /**
   * We are not unsubscribing here since HTTP will clean it self up.
   * https://stackoverflow.com/questions/35042929/do-you-need-to-unsubscribe-from-angular-2-http-calls-to-prevent-memory-leak
   * @param user
   * @returns {IDisposable|Subscription}
   */
  login(user: Login): any {
    return this.postRequest(environment.LOGIN_URL, {'userName': user.username, 'password': user.password})
      // get the response and call .json() to get the JSON data
      // .map((res:Response) => res.json())
      .subscribe((res: Response) => {
        // var payload = res.json();
        const authorization = res['token'];
        const roles = res['roles'];
        console.log('AuthenticationService = ' + authorization);
        if (authorization) {
          localStorage.setItem(COMMON_CONST.CURRENT_USER,
            JSON.stringify({'userName': user.username, 'password': user.password, 'token': authorization, 'roles': roles}));
          this.notificationService.notify('Login was a success', SUBSCRIBER_TYPES.LOGIN_SUCCESS,
            SUBSCRIBER_TYPES.LOGIN_SUCCESS);
        }
        console.log(authorization);
      }, err => {
        console.log(err);
        if (err.status === 401) {
          this.notificationService.notify('Login was NOT a success', SUBSCRIBER_TYPES.LOGIN_FAILED,
            SUBSCRIBER_TYPES.LOGIN_FAILED);
        }
      });
      // ...errors if any
      // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected postRequest(url: string, model: any) {
    return this.httpClient.post(url, JSON.stringify(model))
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  isLoggedIn() {
    return this.getCurrentUser() != null;
  }

  logout(): void {
    localStorage.removeItem(COMMON_CONST.CURRENT_USER);
    this.notificationService.notify('Logout was a success', SUBSCRIBER_TYPES.LOGIN_SUCCESS,
      SUBSCRIBER_TYPES.LOGIN_SUCCESS);
  }

  getCurrentUser() {
    return localStorage.getItem(COMMON_CONST.CURRENT_USER);
  }

  isUberAdmin() {
    if (this.isLoggedIn()) {
      return JSON.parse(this.getCurrentUser()).roles.includes('UBER_ADMIN');
    }
    return false;
  }
}
