import { Injectable, Injector } from '@angular/core';
import { CrudService } from 'my-component-library';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class IntentService extends CrudService<any> {
  private allIntents;
  private intentSearchForm;

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
    return this.getRequest(environment.INIT_PREDEF_INTENTS);
  }

  public save(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_PREDEF_INTENT, model);
  }

  public saveMultiPart(model: FormData): Observable<any> {
    return this.postMultiPartRequest(environment.UPLOAD_PREDEF_INTENT, model);
  }

  public delete(id: string): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public update(model: any): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public getById(id: string): Observable<any> {
    return this.getRequest(environment.GET_PREDEF_INTENT + '/' + id);
  }

  public getAll(): Observable<any[]> {
    return this.getRequest(environment.ALL_INTENTS);
  }

  public getSearchIntentsModel(): Observable<any> {
    return this.getRequest(environment.INIT_SEARCH_INTENT);
  }

  public searchIntents(model): Observable<any> {
    return this.postRequest(environment.SEARCH_INTENT, model);
  }
}
