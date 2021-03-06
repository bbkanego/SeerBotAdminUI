import {AfterViewInit, Component, ElementRef, Injector, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AccountService} from '../../service/account.service';
import {BotAuthenticationService} from '../../service/authentication.service';
import {BaseBotComponent} from './baseBot.component';
import * as $ from 'jquery';

@Component({
  selector: 'seeradmin-left-menu',
  templateUrl: './leftMenu.component.html',
  styleUrls: ['./leftMenu.component.css']
})
export class LeftMenuComponent extends BaseBotComponent implements OnInit, AfterViewInit {

  currentMenu = 'none';
  @ViewChild('maintainIntents') botsLifeUl: ElementRef;
  @ViewChild('maintainModelUl') maintainModelUl: ElementRef;
  @ViewChild('uberAdminTasksUl') uberAdminTasksUl: ElementRef;
  @ViewChild('refDataSubMenuUl') refDataSubMenuUl: ElementRef;
  @ViewChild('sideBarMenu') sideBarMenu: ElementRef;
  @ViewChild('menuHideTrigger') menuHideTrigger: ElementRef;
  private leftMenuShown = true;

  constructor(private authenticationService: BotAuthenticationService,
              injector: Injector, private accountService: AccountService, private rendered2: Renderer2) {
    super(injector);
  }

  ngAfterViewInit() {
    this.currentMenu = this.accountService.getSessionStorageItem('currentMenu');
    if (this.currentMenu === 'maintainIntents') {
      this.rendered2.addClass(this.botsLifeUl.nativeElement, 'in');
    } else {
      this.rendered2.removeClass(this.botsLifeUl.nativeElement, 'in');
    }

    if (this.currentMenu === 'maintainModel') {
      this.rendered2.addClass(this.maintainModelUl.nativeElement, 'in');
    } else {
      this.rendered2.removeClass(this.maintainModelUl.nativeElement, 'in');
    }

    if (this.uberAdminTasksUl) {
      if (this.currentMenu === 'uberAdminTasks') {
        this.rendered2.addClass(this.uberAdminTasksUl.nativeElement, 'in');
      } else {
        this.rendered2.removeClass(this.uberAdminTasksUl.nativeElement, 'in');
      }
    }

    if (this.currentMenu === 'refDataSubMenu') {
      this.rendered2.addClass(this.refDataSubMenuUl.nativeElement, 'in');
    } else {
      this.rendered2.removeClass(this.refDataSubMenuUl.nativeElement, 'in');
    }
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

  trackMenu(menuName: string) {
    this.accountService.setSessionStorageItem('currentMenu', menuName);
  }

  toggleMenu() {
    const sideBarObj = $(this.sideBarMenu.nativeElement);
    const menuHideTriggerObj = $(this.menuHideTrigger.nativeElement);
    if (this.leftMenuShown) {
      sideBarObj.css('marginLeft', '-' + ($(this.sideBarMenu.nativeElement).width() - 20) + 'px');
      menuHideTriggerObj.removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
      this.leftMenuShown = false;
    } else {
      sideBarObj.css('marginLeft', '0px');
      menuHideTriggerObj.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
      this.leftMenuShown = true;
    }
  }
}
