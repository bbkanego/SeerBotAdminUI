import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Option} from 'my-component-library';
import {Subscription} from 'rxjs/Subscription';
import {BaseBotComponent} from '../common/baseBot.component';
import {SubscriptionService} from '../../service/subscription.service';
import {BotAuthenticationService} from '../../service/authentication.service';
import {SeerBotAdminAccount} from '../../model/models';

@Component({
  selector: 'app-maintain-subscription',
  templateUrl: './maintain-subscription.component.html',
  styleUrls: ['./maintain-subscription.component.css']
})
export class MaintainSubscriptionComponent extends BaseBotComponent implements OnInit, OnDestroy {

  private seerBotAdminAccount: SeerBotAdminAccount;

  category: Option[] = [];
  botServiceSubscription: Subscription;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute,
              private authenticationService: BotAuthenticationService,
              private subscriptionService: SubscriptionService, private router: Router) {
    super(injector);
  }

  private loadSubscription(path) {
    this.currentAction = 'add';
    const account: SeerBotAdminAccount = this.authenticationService.getCurrentUserObject();
    this.botServiceSubscription = this.subscriptionService.getByUserName(account.userName).subscribe((model) => {
      this.seerBotAdminAccount = model;
    });
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('view-subscription') > -1) {
        this.loadSubscription(path);
        this.enableBackButton();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
  }

  cancel() {
    if (this.currentAction === 'add') {
      this.router.navigate(['/dashboard']);
    }
  }

  getResourceLocal(key) {
    return this.getResource('maintainAccount', key);
  }
}
