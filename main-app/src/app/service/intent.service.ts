import { Injectable, Injector } from '@angular/core';
import { CrudService } from 'my-component-library';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';
import { BaseBotCrudService } from './baseBotCrud.service';

@Injectable()
export class IntentService extends BaseBotCrudService {
  private allIntents;
  private intentSearchForm = {};

  constructor(injector: Injector) {
    super(injector);
  }

  setIntentSearchForm(model) {
    this.intentSearchForm = model;
  }

  getIntentSearchModel() {
    return this.intentSearchForm;
  }

  setAllIntents(allIntents) {
    this.allIntents = allIntents;
  }

  getAllIntents() {
    return this.allIntents;
  }

  public initModel(): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.getRequest(environment.INIT_PREDEF_INTENTS);
    } else {
      return this.getRequest(environment.INIT_CUSTOM_INTENTS);
    }
  }

  public save(model: any): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.postRequest(environment.SAVE_PREDEF_INTENT, model);
    } else {
      return this.postRequest(environment.SAVE_CUSTOM_INTENT, model);
    }
  }

  public saveMultiPart(model: FormData): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.postMultiPartRequest(environment.UPLOAD_PREDEF_INTENT, model);
    } else {
      return this.postMultiPartRequest(environment.UPLOAD_CUSTOM_INTENT, model);
    }
  }

  public delete(id: string): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public update(model: any): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public getById(id: string): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.getRequest(environment.GET_PREDEF_INTENT + '/' + id);
    } else {
      return this.getRequest(environment.GET_CUSTOM_INTENT + '/' + id);
    }
  }

  public getAll(): Observable<any[]> {
    return this.getRequest(environment.ALL_INTENTS);
  }

  public getSearchIntentsModel(): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.getRequest(environment.INIT_SEARCH_INTENT);
    } else {
      return this.getRequest(environment.INIT_SEARCH_CUSTOM_INTENT);
    }
  }

  public searchIntents(model): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.postRequest(environment.SEARCH_INTENT, model);
    } else {
      return this.postRequest(environment.CUSTOM_SEARCH_INTENT, model);
    }
  }

  public copyPredefinedIntents(categoryCode: string): Observable<any> {
    return this.getRequest(environment.COPY_PREDEF_INTENT + '/' + categoryCode);
  }
}
