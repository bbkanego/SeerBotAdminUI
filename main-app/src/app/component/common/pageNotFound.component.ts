import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { BotAuthenticationService } from '../../service/authentication.service';


@Component({
    selector: 'app-page-not-found',
    templateUrl: './pageNotFound.component.html',
    styleUrls: ['./pageNotFound.component.css']
})
export class PageNotFoundComponent implements OnInit {
    constructor(private authenticationService: BotAuthenticationService, private router: Router) { }

    navigateTo() {
        if (!this.authenticationService.isLoggedIn()) {
            // not logged in so return to the login page
            this.router.navigate(['/login']);
        }
    }

    isLoggedIn() {
        this.authenticationService.isLoggedIn();
    }

    ngOnInit(): void {
    }
}
