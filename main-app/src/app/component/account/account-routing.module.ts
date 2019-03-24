import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from '../admin/landing/landing.component';
import { MaintainAccountComponent } from './maintain-account.component';
import { AuthGuard } from '../../guard/auth.guard';

const ROUTES: Routes = [
    {
        /**
         * https://angular.io/guide/lazy-loading-ngmodules
         * Notice that the path is set to an empty string. This is because the path in
         * AppRoutingModule is already set to customers, so this route in the CustomersRoutingModule,
         * is already within the customers context. Every route in this routing module is a child route.
         */
        path: '',
        component: MaintainAccountComponent
    },
    {
        path: 'init-signup',
        component: MaintainAccountComponent
    },
    {
        path: 'signup',
        component: MaintainAccountComponent
    },
    {
        path: 'init-update-account',
        component: MaintainAccountComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'update-account',
        component: MaintainAccountComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
