import { Component, OnInit } from '@angular/core';
import { BotAuthenticationService } from '../../service/authentication.service';
import { CommonService } from 'my-component-library';

@Component({
  selector: 'app-left-menu',
  templateUrl: './leftMenu.component.html',
  styleUrls: ['./leftMenu.component.css']
})
export class LeftMenuComponent implements OnInit {

  constructor(private authenticationService: BotAuthenticationService, 
    private commonService: CommonService) { }

  ngOnInit() {
  }

  getCommonService() {
    return this.commonService;
  }

  getAuthenticationService() {
    return this.authenticationService;
  }

}
