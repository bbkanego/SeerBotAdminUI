import { Component, OnInit } from '@angular/core';
import { BotAuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './leftMenu.component.html',
  styleUrls: ['./leftMenu.component.css']
})
export class LeftMenuComponent implements OnInit {

  constructor(private authenticationService: BotAuthenticationService) { }

  ngOnInit() {
  }

  getAuthenticationService() {
    return this.authenticationService;
  }

}
