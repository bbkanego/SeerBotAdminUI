import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {BaseReactiveComponent} from 'my-component-library';
import {Observable} from 'rxjs/Observable';
import {DashboardService, SearchBotsTransactions} from '../../service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  allBotsTransaction$: Observable<any>;

  constructor(injector: Injector, private dashboardService: DashboardService) {
    super(injector);
  }

  ngOnInit() {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    this.allBotsTransaction$ = this.dashboardService.getAllBotsTransactions(searchBotsTransactions);
  }

  ngOnDestroy(): void {
  }

}
