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
    return this.postRequest(environment.LOGIN_URL, { 'userName': user.username, 'password': user.password })
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
    this.notificationService.notify('Logout was a success', SUBSCRIBER_TYPES.LOGOUT_SUCCESS,
      SUBSCRIBER_TYPES.LOGOUT_SUCCESS);
  }

  getCurrentUser() {
    return localStorage.getItem(COMMON_CONST.CURRENT_USER);
  }

  isUberAdmin() {
    if (this.isLoggedIn()) {
      return JSON.parse(this.getCurrentUser()).roles.some((role) => {
        return role.code === 'UBER_ADMIN';
      });
    }
    return false;
  }

  isAdmin() {
    if (this.isLoggedIn()) {
      return JSON.parse(this.getCurrentUser()).roles.some((role) => {
        return role.code === 'UBER_ADMIN' || role.code === 'ACCT_ADMIN';
      });
    }
    return false;
  }

  isAccountAdmin() {
    if (this.isLoggedIn()) {
      return JSON.parse(this.getCurrentUser()).roles.some((role) => {
        return role.code === 'ACCT_ADMIN';
      });
    }
    return false;
  }

  private findMatchingStatement(resource) {
    const allRoles: any[] = JSON.parse(this.getCurrentUser()).roles;
    let found = null;
    for (const role of allRoles) {
      const policies: any[] = role.policies;
      if (!policies) { return null; }
      for (const policy of policies) {
        const statements = policy.statements;
        for (const statement of statements) {
          if (statement.resource === resource) {
            found = statement;
            break;
          }
        }
        if (found) { break; }
      }
      if (found) { break; }
    }
    return found;
  }

  private canDoAction(resource, action: string): boolean {
    const statement = this.findMatchingStatement(resource);
    if (!statement) { return false; }
    return statement['actions'].indexOf(action) > -1;
  }

  canEditBot() {
    return this.canDoAction('Bot', 'Update');
  }

  canDeleteBot() {
    return this.canDoAction('Bot', 'Delete');
  }

  canCreateBot() {
    return this.canDoAction('Bot', 'Create');
  }

  canReadBot() {
    return this.canDoAction('Bot', 'Read');
  }

  canTrainBot() {
    return this.canDoAction('Bot', 'Train');
  }

  canTestBot() {
    return this.canDoAction('Bot', 'Train');
  }

  canCreateIntent() {
    return this.canDoAction('Intent', 'Create');
  }

  canUpdateIntent() {
    return this.canDoAction('Intent', 'Update');
  }

  canDeleteIntent() {
    return this.canDoAction('Intent', 'Delete');
  }

  canReadIntent() {
    return this.canDoAction('Intent', 'Read');
  }

  canReadModel() {
    return this.canDoAction('Model', 'Read');
  }

  canDeleteModel() {
    return this.canDoAction('Model', 'Delete');
  }

  canCreateModel() {
    return this.canDoAction('Model', 'Create');
  }

  canUpdateModel() {
    return this.canDoAction('Model', 'Update');
  }

  canDoAll() {
    return this.findMatchingStatement('All') !== null;
  }
}
