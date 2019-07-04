import {NgModule} from '@angular/core';
import {LeftMenuComponent} from './leftMenu.component';
import {RouterModule} from '@angular/router';
import {PageNotFoundComponent} from './pageNotFound.component';
import {CommonComponentRoutingModule} from './commonComp-routing.module';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {BaseBotComponent} from './baseBot.component';

@NgModule({
  imports: [
    RouterModule, CommonComponentRoutingModule, CommonModule
  ],
  declarations: [LeftMenuComponent, PageNotFoundComponent, HeaderComponent, BaseBotComponent],
  exports: [LeftMenuComponent, PageNotFoundComponent, HeaderComponent]
})
export class CommonComponentModule {
}
