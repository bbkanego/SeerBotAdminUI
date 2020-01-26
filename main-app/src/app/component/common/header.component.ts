import {Component} from '@angular/core';
import {BotAuthenticationService} from '../../service/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authenticationService: BotAuthenticationService, private router: Router) {
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

  help() {
    this.router.navigate(['/help']);
  }

  getLoggedInUserDetails() {
    const loggedInUser: any = JSON.parse(this.authenticationService.getCurrentUser());
    return loggedInUser.firstName + ' ' + loggedInUser.lastName;
  }
}
