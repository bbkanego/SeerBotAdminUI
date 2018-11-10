import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtilsModule } from 'my-component-library';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaintainBotComponent } from './maintain-bot/maintain-bot.component';
import { AdminRoutingModule } from './admin-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MaintainIntentsComponent } from './maintain-intents/maintain-intents.component';

@NgModule({
  imports: [
    CommonModule, CommonUtilsModule, FormsModule, ReactiveFormsModule, AdminRoutingModule
  ],
  declarations: [MaintainBotComponent, LandingComponent, MaintainIntentsComponent]
})
export class AdminModule { }
