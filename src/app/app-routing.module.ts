import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: []
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: []
  },
  {
    // This is default route. this will automatically redirect the user to dashboard if the context path is "/"
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadChildren:
      './common/commonComp.module#CommonComponentModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      ROUTES //, { enableTracing: true } // <-- debugging purposes only
    )
  ],
  // imports:[RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})], -- allows preloading of lazy modules
  exports: [RouterModule]
})
export class AppRoutingModule {}
