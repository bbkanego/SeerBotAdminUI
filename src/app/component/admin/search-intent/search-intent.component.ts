import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { IntentService } from '../../../service/intent.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-search-intent',
  templateUrl: './search-intent.component.html',
  styleUrls: ['./search-intent.component.css']
})
export class SearchIntentComponent implements OnInit, OnDestroy {

  intentsResults;
  allIntents: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private intentService: IntentService) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.allIntents = this.intentService.getAll().subscribe(results => {
        this.intentsResults = results;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.allIntents) {
      this.allIntents.unsubscribe();
    }
  }

}
