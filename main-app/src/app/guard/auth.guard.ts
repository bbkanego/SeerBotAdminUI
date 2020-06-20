import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {BotAuthenticationService} from '../service/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: BotAuthenticationService) {
  }

  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

    if (this.authenticationService.isLoggedIn()) {
      return true;
    }

    // not logged in so return to the login page
    this.router.navigate(['/login']);
    return false;
  }
}
