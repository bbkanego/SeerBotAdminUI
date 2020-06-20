import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationComponent} from './component/authentication/authentication.component';
import {DashboardComponent} from './component/dashboard/dashboard.component';
import {AuthGuard} from './guard/auth.guard';
import {LogoutGuard} from './guard/logout.guard';

const ROUTES: Routes = [
  {
    path: 'login',
    component: AuthenticationComponent,
    canActivate: [LogoutGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./component/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./component/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ref-data',
    loadChildren: () => import('./component/refdata/refdata.module').then(m => m.RefDataModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'model',
    loadChildren: () => import('./component/nlp-model/nlp-model.module').then(m => m.NlpModelModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'state-machine',
    loadChildren:
      () => import('./component/state-machine/state-machine.module').then(m => m.StateMachineModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription',
    loadChildren:
      () => import('./component/subscription/subscription.module').then(m => m.SubscriptionModule),
    canActivate: [AuthGuard]
  },
  {
    // This is default route. this will automatically redirect the user to dashboard if the context path is "/"
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  /*{
    path: 'help',
    loadChildren: './component/help/help.module#HelpModule',
    canActivate: [AuthGuard]
  },*/
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      ROUTES,
      {onSameUrlNavigation: 'reload'} // , { enableTracing: true } // <-- debugging purposes only
    )
  ],
  // imports:[RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})], -- allows preloading of lazy modules
  exports: [RouterModule]
})
export class AppRoutingModule {
}
