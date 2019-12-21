import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { SubscriptionService } from '../../../service/subscription.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
    selector: 'app-search-plans',
    templateUrl: './searchPlans.component.html',
    styleUrls: ['./searchPlans.component.css']
})
export class SearchPlansComponent extends BaseBotComponent implements OnInit, OnDestroy {
    planResults: any[];
    searchCriteriaSubscription: Subscription;
    notificationSub: Subscription;
    searchContext = 'searchPlans';

    constructor(
        private subscriptionService: SubscriptionService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        const searchCriteriaModel = this.subscriptionService.getSearchCriteriaModel();
        this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
            this.searchPlans();
        });

        this.notificationSub = this.notificationService
            .onNotification()
            .subscribe((data: any) => {
                if (
                    data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_SUBSCRIPTION_SEARCH_RESULTS
                ) {
                    this.searchPlans();
                }
            });
    }

    private searchPlans() {
        this.searchCriteriaSubscription = this.subscriptionService
            .getAllPlans()
            .subscribe(results => {
                this.planResults = results;
            });
    }

    ngOnDestroy(): void {
        if (this.searchCriteriaSubscription) {
            this.searchCriteriaSubscription.unsubscribe();
        }
        if (this.notificationSub) {
            this.notificationSub.unsubscribe();
        }
    }

    editPlan(id: string) {
        this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
    }

    getResourceLocal(key: string): string {
        return this.getResource('subscription', 'plan.' + key);
    }
}
