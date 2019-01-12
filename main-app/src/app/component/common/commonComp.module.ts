import { NgModule } from '@angular/core';
import { LeftMenuComponent } from './leftMenu.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pageNotFound.component';
import { CommonComponentRoutingModule } from './commonComp-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    RouterModule, CommonComponentRoutingModule, CommonModule
  ],
  declarations: [LeftMenuComponent, PageNotFoundComponent],
  exports: [LeftMenuComponent, PageNotFoundComponent]
})
export class CommonComponentModule { }
