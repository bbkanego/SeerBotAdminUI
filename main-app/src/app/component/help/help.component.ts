import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'seeradmin-maintain-bot',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {

  constructor(private router: Router) {
  }

  navigateTo(path) {
    this.router.navigate([path]);
  }

}
