import { NgModule } from '@angular/core';
import { LeftMenuComponent } from './leftMenu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule
  ],
  declarations: [LeftMenuComponent],
  exports: [LeftMenuComponent]
})
export class CommonComponentModule { }
