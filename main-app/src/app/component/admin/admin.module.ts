import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule, DataTableModule, InputModule, ModalModule, SelectorModule, StompService} from 'seerlogics-ngui-components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaintainBotComponent} from './maintain-bot/maintain-bot.component';
import {AdminRoutingModule} from './admin-routing.module';
import {LandingComponent} from './landing/landing.component';
import {MaintainIntentsComponent} from './maintain-intents/maintain-intents.component';
import {BotService} from '../../service/bot.service';
import {SearchBotComponent} from './search-bot/search-bot.component';
import {SearchIntentComponent} from './search-intent/search-intent.component';
import {LaunchBotComponent} from './launch-bot/launch-bot.component';
import {SearchIntentCriteriaComponent} from './search-intent/search-intent-criteria.component';
import {SearchBotCriteriaComponent} from './search-bot/search-bot-criteria.component';
import {TestBotComponent} from './test-bot/test-bot.component';
import {ReTrainBotComponent} from './maintain-intents/re-train-bot.component';

@NgModule({
  imports: [
    CommonModule,
    InputModule,
    SelectorModule,
    ButtonModule,
    DataTableModule, ModalModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ],
  declarations: [
    ReTrainBotComponent,
    MaintainBotComponent,
    LandingComponent,
    MaintainIntentsComponent,
    SearchBotComponent,
    SearchBotCriteriaComponent,
    SearchIntentCriteriaComponent,
    SearchIntentComponent,
    LaunchBotComponent,
    TestBotComponent
  ],
  providers: [BotService, StompService]
})
export class AdminModule {
}
