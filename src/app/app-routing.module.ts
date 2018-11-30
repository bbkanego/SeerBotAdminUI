import { DashboardComponent } from './component/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './component/authentication/authentication.component';
import { LogoutGuard } from './guard/logout.guard';
import { AuthGuard } from './guard/auth.guard';

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
    path: 'admin',
    loadChildren: './component/admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  {
    // This is default route. this will automatically redirect the user to dashboard if the context path is "/"
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      ROUTES, {onSameUrlNavigation: 'reload'} //, { enableTracing: true } // <-- debugging purposes only
    )
  ],
  // imports:[RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})], -- allows preloading of lazy modules
  exports: [RouterModule]
})
export class AppRoutingModule {}
