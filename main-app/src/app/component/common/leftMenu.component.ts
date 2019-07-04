import {Component, Injector, OnInit} from '@angular/core';
import {BotAuthenticationService} from '../../service/authentication.service';
import {CommonService} from 'my-component-library';
import {BaseBotComponent} from "./baseBot.component";

@Component({
  selector: 'app-left-menu',
  templateUrl: './leftMenu.component.html',
  styleUrls: ['./leftMenu.component.css']
})
export class LeftMenuComponent extends BaseBotComponent implements OnInit {

  constructor(private authenticationService: BotAuthenticationService, injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

  getResourceLocal(key: string): string {
    return this.getResource('leftMenu', key);
  }

  getCommonService() {
    return this.commonService;
  }

  getAuthenticationService() {
    return this.authenticationService;
  }

}
