import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { BotAuthenticationService } from '../service/authentication.service';

@Injectable()
export class LogoutGuard implements CanActivate {

  constructor(private authenticationService: BotAuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.authenticationService.isLoggedIn()) {
      return false;
    }
    return true;
  }
}
