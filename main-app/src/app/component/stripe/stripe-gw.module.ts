import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { StripeComponent } from './stripe-gw.component';

@NgModule({
    declarations: [StripeComponent],
    imports: [CommonModule, FormsModule],
    exports: [],
    providers: [],
})
export class StripeGWModule { }
