import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MaintainBotComponent } from './maintain-bot/maintain-bot.component';
import { MaintainIntentsComponent } from './maintain-intents/maintain-intents.component';
import { SearchBotComponent } from './search-bot/search-bot.component';
import { SearchIntentComponent } from './search-intent/search-intent.component';
import { LaunchBotComponent } from './launch-bot/launch-bot.component';

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
        path: 'search_bots_to_launch',
        component: SearchBotComponent,
        children: [
            {
                path: 'launch_start/:id',
                component: LaunchBotComponent
            },
            {
                path: 'launched',
                component: LaunchBotComponent
            }
        ]
    },
    {
        path: 'search_bot',
        component: SearchBotComponent,
        children: [
            {
                path: 'edit/:id',
                component: MaintainBotComponent
            },
            {
                path: 'all',
                component: SearchBotComponent
            },
            {
                path: 'criteria',
                component: SearchBotComponent
            },
            {
                path: 'search',
                component: SearchBotComponent
            },
            {
                path: 'clear_criteria',
                component: SearchBotComponent
            }
        ]
    },
    {
        path: 'add-intent',
        component: MaintainIntentsComponent
    },
    {
        path: 'edit-intent/:id',
        component: MaintainIntentsComponent
    },
    {
        path: 'delete-intent',
        component: MaintainIntentsComponent
    },
    {
        path: 'search-intent',
        component: SearchIntentComponent,
        children: [
            {
                path: 'edit/:id',
                component: MaintainIntentsComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {

}
