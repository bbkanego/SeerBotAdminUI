import {Injectable, Injector} from '@angular/core';
import {BaseBotCrudService} from './baseBotCrud.service';
import {Observable} from 'rxjs';
import {environment} from '../environments/frozenEnvironment';

@Injectable()
export class AccountService extends BaseBotCrudService {
  constructor(injector: Injector) {
    super(injector);
  }

  initModel(): Observable<any> {
    return this.getRequest(environment.INIT_ACCT_URL + '/person');
  }

  save(model: any): Observable<any> {
    return this.postRequest(environment.SIGN_UP_ACCT_URL, model);
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

  initModelByType(type: string): Observable<any> {
    return this.getRequest(environment.INIT_SUBSCRIPTION_URL + '/' + type);
  }
}
