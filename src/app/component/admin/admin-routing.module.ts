import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MaintainBotComponent } from './maintain-bot/maintain-bot.component';
import { MaintainIntentsComponent } from './maintain-intents/maintain-intents.component';

const routes: Routes = [
    {
        /**
         * https://angular.io/guide/lazy-loading-ngmodules
         * Notice that the path is set to an empty string. This is because the path in
         * AppRoutingModule is already set to customers, so this route in the CustomersRoutingModule,
         * is already within the customers context. Every route in this routing module is a child route.
         */
        path: '',
        component: LandingComponent
    },
    {
        path: 'add-bot',
        component: MaintainBotComponent
    },
    {
        path: 'edit-bot',
        component: MaintainBotComponent
    },
    {
        path: 'maintain-intents',
        component: MaintainIntentsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {

}
