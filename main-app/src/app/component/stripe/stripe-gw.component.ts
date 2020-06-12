import { Component, Injector, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BaseBotComponent } from '../common/baseBot.component';

@Component({
    selector: 'app-stripe',
    templateUrl: './stripe-gw.component.html',
    styleUrls: ['./stripe-gw.component.css']
})
export class StripeComponent extends BaseBotComponent implements OnInit {
    @Input() amount: number;
    @Input() description: string;
    @ViewChild('cardElement') cardElement: ElementRef;

    stripe: any; // : stripe.Stripe;
    card: any;
    cardErrors: any;

    loading = false;
    confirmation: any;

    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.stripe = Stripe('pk_test_GnArJnwbKCoVF7LaG04jwE6c00b7FZnBh6');
        const elements = this.stripe.elements();

        this.card = elements.create('card');
        this.card.mount(this.cardElement.nativeElement);

        this.card.addEventListener('change', ({ error }) => {
            this.cardErrors = error && error.message;
        });
    }

    onSubmit(event) {

    }

    revert() {

    }
}
