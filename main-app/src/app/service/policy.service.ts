import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/frozenEnvironment';
import {BaseBotCrudService} from './baseBotCrud.service';

@Injectable()
export class PolicyService extends BaseBotCrudService {
  searchCriteriaModel: any;

  constructor(injector: Injector) {
    super(injector);
  }

  initModel(): Observable<any> {
    return this.getRequest(environment.SAVE_POLICY_URL + '/init');
  }

  initSearchModel(): Observable<any> {
    return this.getRequest(environment.SAVE_POLICY_URL + '/init');
  }

  setSearchCriteriaModel(model) {
    this.searchCriteriaModel = model;
  }

  getSearchCriteriaModel() {
    return this.searchCriteriaModel;
  }

  searchPolicy(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_POLICY_URL, model);
  }

  save(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_POLICY_URL, model);
  }

  delete(id: string): Observable<any> {
    return this.deleteRequest(environment.SAVE_POLICY_URL, id);
  }

  update(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_POLICY_URL, model);
  }

  getById(id: string): Observable<any> {
    return this.getRequest(environment.SAVE_POLICY_URL + '/' + id);
  }

  getAll(): Observable<any[]> {
    return this.getRequest(environment.SAVE_POLICY_URL);
  }
}
