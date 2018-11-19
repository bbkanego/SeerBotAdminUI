import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BotService } from '../../../service/bot.service';
import { NotificationService } from 'my-component-library';
import { BIZ_BOTS_CONSTANTS } from '../../model/Constants';

@Component({
  selector: 'app-search-bot',
  templateUrl: './search-bot.component.html',
  styleUrls: ['./search-bot.component.css']
})
export class SearchBotComponent implements OnInit, OnDestroy {

  botResults;
  getAllSubscription: Subscription;

  constructor(private botService: BotService, private router: Router,
              private activatedRoute: ActivatedRoute, private notificationService: NotificationService) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.getAllResults();
    });

    this.notificationService.onNotification().subscribe((data: any) => {
      if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_BOTS_SEARCH_RESULTS) {
        this.getAllResults();
      }
    });
  }

  private getAllResults() {
    this.getAllSubscription = this.botService.getAll().subscribe(results => {
      this.botResults = results;
    });
  }

  ngOnDestroy(): void {
    if (this.getAllSubscription) {
      this.getAllSubscription.unsubscribe();
    }
  }

  editBot(id) {
    this.router.navigate(['edit', id], { relativeTo: this.activatedRoute });
  }
}
