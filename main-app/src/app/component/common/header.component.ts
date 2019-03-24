import { Component } from '@angular/core';
import { BotAuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authenticationService: BotAuthenticationService) {}

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
}
