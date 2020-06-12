import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../environments/frozenEnvironment';
import {BaseBotCrudService} from './baseBotCrud.service';

export interface CopyIntents {
  intentName?: string;
  sourceCategoryCode?: string;
  sourceCategoryTypeCode?: string;
  targetCategoryCode?: string;
  targetIntentName?: string;
}

@Injectable()
export class IntentService extends BaseBotCrudService {
  private allIntents;
  private intentSearchForm = null;

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
    if (this.getActionContext() === 'predefined') {
      return this.deleteRequest(environment.SAVE_PREDEF_INTENT, id);
    } else {
      return this.deleteRequest(environment.SAVE_CUSTOM_INTENT, id);
    }
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

  public getIntentsByCategoryCode(catCode: string): Observable<any> {
    return this.getRequest(environment.CUSTOM_SEARCH_INTENT + '/' + catCode);
  }

  public searchIntents(model): Observable<any> {
    if (this.getActionContext() === 'predefined') {
      return this.postRequest(environment.SEARCH_INTENT, model);
    } else {
      return this.postRequest(environment.CUSTOM_SEARCH_INTENT, model);
    }
  }

  public copyPredefinedIntents(copyIntents: CopyIntents): Observable<any> {
    return this.postRequest(environment.COPY_PREDEF_INTENT, copyIntents);
  }

  public deleteAllIntentsByCategory(catCode: string): Observable<any> {
    return this.deleteRequest(environment.SAVE_CUSTOM_INTENT + '/delete-all', catCode);
  }

  public associateIntents(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_CUSTOM_INTENT + '/associateIntents', model);
  }
}
