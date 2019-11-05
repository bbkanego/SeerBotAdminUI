import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MaintainBotComponent } from './maintain-bot/maintain-bot.component';
import { MaintainIntentsComponent } from './maintain-intents/maintain-intents.component';
import { SearchBotComponent } from './search-bot/search-bot.component';
import { SearchIntentComponent } from './search-intent/search-intent.component';
import { LaunchBotComponent } from './launch-bot/launch-bot.component';
import { SearchIntentCriteriaComponent } from './search-intent/search-intent-criteria.component';
import { SearchBotCriteriaComponent } from './search-bot/search-bot-criteria.component';
import { TestBotComponent } from './test-bot/test-bot.component';

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
        path: 'init_search_bot',
        component: SearchBotCriteriaComponent
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
            },
            {
                path: 'launch_start/:id',
                component: LaunchBotComponent
            },
            {
                path: 'launched',
                component: LaunchBotComponent
            },
            {
                path: 'test_start/:id',
                component: TestBotComponent
            },
            {
                path: 'test',
                component: TestBotComponent
            }
        ]
    },
    {
        path: 'test_start/:id',
        component: TestBotComponent
    },
    {
        path: 'add_intent',
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
        path: 'start_search_intent',
        component: SearchIntentCriteriaComponent
    },
    {
        path: 'search_intent',
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
