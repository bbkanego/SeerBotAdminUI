import {CrudService} from 'my-component-library';
import {Injectable, Injector} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../environments/environment';

@Injectable()
export class NlpModelService extends CrudService<any> {
  constructor(injector: Injector) {
    super(injector);
  }

  delete(id: string): Observable<any> {
    return undefined;
  }

  getAll(): Observable<any[]> {
    return undefined;
  }

  getById(id: string): Observable<any> {
    return undefined;
  }

  initModel(): Observable<any> {
    return this.getRequest(environment.INIT_TRAIN_MODEL);
  }

  trainModel(model: any): Observable<any> {
    return this.postRequest(environment.TRAIN_MODEL, model);
  }

  save(model: any): Observable<any> {
    return undefined;
  }

  update(model: any): Observable<any> {
    return undefined;
  }
}
