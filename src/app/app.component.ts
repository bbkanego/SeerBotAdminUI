import { Component, OnInit } from '@angular/core';

import { BotAuthenticationService } from './service/authentication.service';
import { CommonService } from 'my-component-library';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  showAuthenticatedItems: boolean;

  constructor(private authenticationService: BotAuthenticationService, 
    private router: Router, private commonService: CommonService) {}

  onActivate(eventObj) {

  }

  onDeactivate(eventObj) {

  }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.showAuthenticatedItems = true;
      // this.commonService.getMessages();
    } else {
      this.showAuthenticatedItems = false;
    }
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
