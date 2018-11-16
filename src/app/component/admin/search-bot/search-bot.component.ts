import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BotService } from '../../../service/bot.service';

@Component({
  selector: 'app-search-bot',
  templateUrl: './search-bot.component.html',
  styleUrls: ['./search-bot.component.css']
})
export class SearchBotComponent implements OnInit, OnDestroy {

  botResults;
  getAllSubscription: Subscription;

  constructor(private botService: BotService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.getAllSubscription = this.botService.getAll().subscribe(results => {
        this.botResults = results;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.getAllSubscription) {
      this.getAllSubscription.unsubscribe();
    }
  }
}
