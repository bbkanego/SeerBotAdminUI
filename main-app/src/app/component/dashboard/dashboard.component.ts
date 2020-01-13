import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ChartData, ChartDataSet} from 'my-component-library';
import {Observable} from 'rxjs/Observable';
import {DashboardService, Interval, SearchBotsTransactions} from '../../service/dashboard.service';
import {BaseBotComponent} from '../common/baseBot.component';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseBotComponent implements OnInit, OnDestroy {

  allBotsTransaction$: Observable<any>;
  allBotsTransactionData: any[];
  allBotsTransactionSubscription: Subscription;

  chartData: ChartData;

  constructor(injector: Injector, private dashboardService: DashboardService, private router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.getAllTransactions(null);
  }

  private drawChart() {

    let successTransactionsCount = 0;
    let failureTransactionsCount = 0;
    let partialTransactionsCount = 0;
    let totalNumOfTransactions = 0;
    this.allBotsTransactionData.forEach(botTrans => {
      successTransactionsCount += botTrans.successTransactions.length;
      failureTransactionsCount += botTrans.failureTransactions.length;
      partialTransactionsCount += botTrans.maybeTransactions.length;
    });
    totalNumOfTransactions = successTransactionsCount + failureTransactionsCount + totalNumOfTransactions;

    const dataSets: ChartDataSet[] = [{
      label: '',
      backgroundColor: ['#66cc00', '#ff4000', '#ffff00'],
      data: [(successTransactionsCount / totalNumOfTransactions) * 100,
        (failureTransactionsCount / totalNumOfTransactions) * 100,
        (partialTransactionsCount / totalNumOfTransactions) * 100]
    } as ChartDataSet];

    const chartOptions = {
      title: {
        display: true,
        text: 'Bot Performance (Last Month)'
      }
    };

    this.chartData = {
      type: 'doughnut',
      labels: ['Success', 'Failure', 'Close Match'],
      dataSets: dataSets,
      options: chartOptions
    };
  }

  viewTransactionDetails(botId, type) {
    this.dashboardService.botDetail = this.allBotsTransactionData.filter((bot, index, array) => {
      return bot.id === botId;
    });
    this.dashboardService.allBotsTransactionData = this.allBotsTransactionData;

    this.router.navigate(['/admin/reTrain_bot'],
      {queryParams: {action: 'reTrain', 'botId': botId, 'type': type}});
  }

  getAllTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  getDailyTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.DAILY;
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  get7DaysTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_7_DAYS;
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  getMonthlyTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_30_DAYS;
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  get6MonthlyTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_180_DAYS;
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  getLastYearTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_YEAR;
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  sendGetAllBotsTransactionsCall(searchBotsTransactions: SearchBotsTransactions) {
    this.allBotsTransactionSubscription = this.dashboardService.getAllBotsTransactions(searchBotsTransactions)
      .subscribe(result => {
        this.allBotsTransactionData = result;
        this.drawChart();
      });
  }

  ngOnDestroy(): void {
    if (this.allBotsTransactionSubscription) {
      this.allBotsTransactionSubscription.unsubscribe();
    }
  }

  getResourceLocal(key: string) {
    return this.getResource('dashboard', key);
  }

}
