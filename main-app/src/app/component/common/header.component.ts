import {Component, Injector} from '@angular/core';
import {BotAuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';
import {BaseBotComponent} from './baseBot.component';
import * as $ from 'jquery';

@Component({
  selector: 'seeradmin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseBotComponent {
  constructor(private authenticationService: BotAuthenticationService, private router: Router,
              private injector: Injector) {
    super(injector);
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  logout() {
    this.authenticationService.logout();
  }

  account() {
    this.router.navigate(['/account/view-subscription']);
  }

  getLoggedInUserDetails() {
    const loggedInUser: any = JSON.parse(this.authenticationService.getCurrentUser());
    return loggedInUser.firstName + ' ' + loggedInUser.lastName;
  }

  /**
   * This will hide and show the menu on mobile devices.
   * @param event
   */
  onMenuClick(event: Event) {
    $('#sidebar').toggleClass('active');
    $(event.target).toggleClass('active');
  }
}
