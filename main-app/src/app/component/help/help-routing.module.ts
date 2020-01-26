import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HelpComponent} from './help.component';

const ROUTE: Routes = [
  {path: '', component: HelpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(ROUTE)],
  exports: [RouterModule]
})
export class HelpRoutingModule {
}

