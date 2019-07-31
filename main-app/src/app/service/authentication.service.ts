import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { COMMON_CONST, HttpClient, Login, Notification, NotificationService, SUBSCRIBER_TYPES } from 'my-component-library';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/frozenEnvironment';

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
        const userName = res['userName'];
        console.log('AuthenticationService = ' + authorization);
        if (authorization) {
          localStorage.setItem(COMMON_CONST.CURRENT_USER,
            JSON.stringify(res));
          this.notificationService.notify('Login was a success', SUBSCRIBER_TYPES.LOGIN_SUCCESS,
            SUBSCRIBER_TYPES.LOGIN_SUCCESS);
        }
        console.log(authorization);
      }, err => {
        this.notificationService.onNotification().subscribe((data: Notification) => {
          if (SUBSCRIBER_TYPES.NETWORK_ERROR === data.type) {
            const error = data.message;
            if (error.status === 401) {
              this.notificationService.notify('Login was NOT a success', SUBSCRIBER_TYPES.LOGIN_FAILED,
                SUBSCRIBER_TYPES.LOGIN_FAILED);
            }
          }
        });
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
      return JSON.parse(this.getCurrentUser()).roles.some((value: string) => {
        return value === 'UBER_ADMIN';
      });
    }
    return false;
  }

  isAdmin() {
    if (this.isLoggedIn()) {
      return JSON.parse(this.getCurrentUser()).roles.some((value: string) => {
        return value === 'UBER_ADMIN' || value === 'ACCT_ADMIN';
      });
    }
    return false;
  }
}
