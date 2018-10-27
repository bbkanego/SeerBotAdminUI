import { NgModule } from '@angular/core';
import { LeftMenuComponent } from './leftMenu.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pageNotFound.component';
import { CommonComponentRoutingModule } from './commonComp-routing.module';

@NgModule({
  imports: [
    RouterModule, CommonComponentRoutingModule
  ],
  declarations: [LeftMenuComponent, PageNotFoundComponent],
  exports: [LeftMenuComponent, PageNotFoundComponent]
})
export class CommonComponentModule { }
