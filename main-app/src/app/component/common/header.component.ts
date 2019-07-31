import {Component} from '@angular/core';
import {BotAuthenticationService} from '../../service/authentication.service';
import {COMMON_CONST} from 'my-component-library';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authenticationService: BotAuthenticationService) {
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  onClick(event: Event) {
    $('#sidebar').toggleClass('active');
    $(event.target).toggleClass('active');
  }

  logout() {
    this.authenticationService.logout();
  }

  getLoggedInUserDetails() {
    const loggedInUser: any = JSON.parse(this.authenticationService.getCurrentUser());
    return loggedInUser.firstName + ' ' + loggedInUser.lastName;
  }
}
