import {Component, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChartComponent, ChartData, ChartDataSet} from 'seerlogics-ngui-components';
import {Observable, Subscription} from 'rxjs';
import {DashboardService, Interval, SearchBotsTransactions, TransactionData} from '../../service/dashboard.service';
import {BaseBotComponent} from '../common/baseBot.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseBotComponent implements OnInit, OnDestroy {

  allBotsTransaction$: Observable<any>;
  allBotsTransactionData: any[] = [];
  allBotsTransactionSubscription: Subscription;
  @ViewChild('chartComponent') chartComponent: ChartComponent;
  currentInterval = 'NONE';

  chartData: ChartData;

  constructor(injector: Injector, private dashboardService: DashboardService, private router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.getAllTransactions(null);
  }

  viewTransactionDetails(botId, type) {
    this.dashboardService.botDetail = this.allBotsTransactionData.filter((bot: TransactionData, index, array) => {
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
    this.currentInterval = 'All Time';
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  getDailyTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.DAILY;
    this.currentInterval = Interval.DAILY.toString();
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  get7DaysTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_7_DAYS;
    this.currentInterval = Interval.LAST_7_DAYS.toString();
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  getMonthlyTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_30_DAYS;
    this.currentInterval = Interval.LAST_30_DAYS.toString();
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  get6MonthlyTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_180_DAYS;
    this.currentInterval = Interval.LAST_180_DAYS.toString();
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  getLastYearTransactions(botId: string) {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    if (botId) {
      searchBotsTransactions.botId = botId;
    }
    searchBotsTransactions.searchInterval = Interval.LAST_YEAR;
    this.currentInterval = Interval.LAST_YEAR.toString();
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

  private drawChart() {
    let successTransactionsCount = 0;
    let failureTransactionsCount = 0;
    let partialTransactionsCount = 0;
    let totalNumOfTransactions = 0;
    this.allBotsTransactionData.forEach((botTrans: TransactionData) => {
      successTransactionsCount += botTrans.successTransactions.length;
      failureTransactionsCount += botTrans.failureTransactions.length;
      partialTransactionsCount += botTrans.maybeTransactions.length;
    });
    totalNumOfTransactions = successTransactionsCount + failureTransactionsCount + partialTransactionsCount;

    let dataSets: ChartDataSet[] = [{
      label: '',
      backgroundColor: ['#66cc00', '#ff4000', '#ffff00'],
      data: [Math.round((successTransactionsCount / totalNumOfTransactions) * 100),
        Math.round((failureTransactionsCount / totalNumOfTransactions) * 100),
        Math.round((partialTransactionsCount / totalNumOfTransactions) * 100)]
    } as ChartDataSet];

    const chartOptions = {
      title: {
        display: true,
        text: this.getResourceLocal('botPerformance.headingAll') + ' (' + this.currentInterval + ')'
      }
    };

    this.chartData = {
      type: 'doughnut',
      labels: ['Success', 'Failure', 'Close Match'],
      dataSets: dataSets,
      options: chartOptions
    };

    if (totalNumOfTransactions === 0) {
      dataSets = null;
      this.chartData = null;
    }

    // console.log(JSON.stringify(this.chartData));
    if (this.chartComponent) {
      this.chartComponent.reInit(this.chartData);
    }
  }

}
