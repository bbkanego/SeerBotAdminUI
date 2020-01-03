import {BaseBotCrudService} from './baseBotCrud.service';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/frozenEnvironment';

export interface SearchBotsTransactions {
  transactionSuccess: boolean;
  transactionMaybe: boolean;
}

@Injectable()
export class DashboardService extends BaseBotCrudService {

  constructor(injector: Injector) {
    super(injector);
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
