import {BaseBotCrudService} from './baseBotCrud.service';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/frozenEnvironment';

export enum Interval {
  MONTHLY = 'MONTHLY', DAILY = 'DAILY', LAST_30_DAYS = 'LAST_30_DAYS', LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_YEAR = 'LAST_YEAR', THIS_YEAR = 'THIS_YEAR', LAST_180_DAYS = 'LAST_180_DAYS'
}

export interface SearchBotsTransactions {
  transactionSuccess?: boolean;
  transactionMaybe?: boolean;
  botId?: string;
  searchInterval?: Interval;
}

export interface TransactionData {
  successTransactions?: [],
  failureTransactions?: [],
  maybeTransactions?: [],
  id?: string
}

@Injectable()
export class DashboardService extends BaseBotCrudService {

  constructor(injector: Injector) {
    super(injector);
  }

  private _botDetail;

  get botDetail() {
    return this._botDetail;
  }

  set botDetail(value) {
    this._botDetail = value;
  }

  private _allBotsTransactionData;

  get allBotsTransactionData() {
    return this._allBotsTransactionData;
  }

  set allBotsTransactionData(value) {
    this._allBotsTransactionData = value;
  }

  getAllBotsTransactions(model: SearchBotsTransactions): Observable<any> {
    return this.postRequest(environment.ALL_BOTS_TRANSACTIONS, model);
  }

  initModel(): Observable<any> {
    throw new Error('Method not implemented.');
  }

  save(model: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  delete(id: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  update(model: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getById(id: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<any[]> {
    throw new Error('Method not implemented.');
  }


}
