import { Injectable, Injector } from '@angular/core';
import { CrudService } from 'my-component-library';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';

@Injectable()
export class IntentService extends CrudService<any> {
  constructor(injector: Injector) {
    super(injector);
  }

  public initModel(): Observable<any> {
    return this.getRequest(environment.INIT_PREDEF_INTENTS);
  }

  public save(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_PREDEF_INTENT, model);
  }

  public delete(id: string): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public update(model: any): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public getById(id: string): Observable<any> {
    return this.getRequest(environment.ALL_INTENTS + '/' + id);
  }

  public getAll(): Observable<any[]> {
    return this.getRequest(environment.ALL_INTENTS);
  }
}
