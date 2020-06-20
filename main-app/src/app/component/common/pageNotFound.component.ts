import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BotAuthenticationService} from '../../service/authentication.service';


@Component({
  selector: 'app-page-not-found',
  templateUrl: './pageNotFound.component.html',
  styleUrls: ['./pageNotFound.component.css']
})
export class PageNotFoundComponent implements OnInit {
  constructor(private authenticationService: BotAuthenticationService, private router: Router) {
  }

  navigateTo() {
    if (!this.authenticationService.isLoggedIn()) {
      // not logged in so return to the login page
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  ngOnInit(): void {
  }
}
