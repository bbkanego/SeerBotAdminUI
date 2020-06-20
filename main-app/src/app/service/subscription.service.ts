import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/frozenEnvironment';
import {BaseBotCrudService} from './baseBotCrud.service';
import {ChangePassword} from '../component/account/maintain-subscription.component';

@Injectable()
export class SubscriptionService extends BaseBotCrudService {

  searchCriteriaModel: any;

  constructor(injector: Injector) {
    super(injector);
  }

  getById(id: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<any[]> {
    throw new Error('Method not implemented.');
  }

  initModel(): Observable<any> {
    return this.getRequest(environment.INIT_SUBSCRIPTION_URL + '/person');
  }

  getByUserName(userName: string): Observable<any> {
    return this.getRequest(environment.SUBSCRIPTION_BY_USERNAME_URL + '/' + userName);
  }

  save(model: any): Observable<any> {
    return this.postRequest(environment.SUBSCRIPTION_URL, model);
  }

  delete(id: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  initTierModel(): Observable<any> {
    return this.getRequest(environment.INIT_TIER_URL);
  }

  searchTiers(): Observable<any> {
    return this.getRequest(environment.GET_ALL_TIER_URL);
  }

  saveTier(model: any): Observable<any> {
    return this.postRequest(environment.TIER_URL, model);
  }

  deleteTier(id: string): Observable<any> {
    return this.deleteRequest(environment.TIER_URL, id);
  }

  initSearchModel(): Observable<any> {
    return this.getRequest(environment.INIT_TIER_URL);
  }

  setSearchCriteriaModel(model) {
    this.searchCriteriaModel = model;
  }

  getSearchCriteriaModel() {
    return this.searchCriteriaModel;
  }

  update(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_CATEGORY_URL, model);
  }

  getTierById(id: string): Observable<any> {
    return this.getRequest(environment.TIER_URL + '/' + id);
  }

  initPlanModel(): Observable<any> {
    return this.getRequest(environment.INIT_PLAN_URL);
  }

  getAllPlans(): Observable<any> {
    return this.getRequest(environment.GET_ALL_PLAN_URL);
  }

  savePlan(model: any): Observable<any> {
    return this.postRequest(environment.PLAN_URL, model);
  }

  deletePlan(id: string): Observable<any> {
    return this.deleteRequest(environment.PLAN_URL, id);
  }

  getPlanById(id: string): Observable<any> {
    return this.getRequest(environment.PLAN_URL + '/' + id);
  }

  changePassword(changePassword: ChangePassword): Observable<any> {
    return this.postRequest(environment.ACCT_URL + '/changePassword', changePassword);
  }
}
