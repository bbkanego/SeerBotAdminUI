import { CrudService } from 'my-component-library';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/frozenEnvironment';
import { BaseBotCrudService } from './baseBotCrud.service';

@Injectable()
export class NlpModelService extends BaseBotCrudService {
  constructor(injector: Injector) {
    super(injector);
  }

  delete(id: string): Observable<any> {
    return this.deleteRequest(environment.TRAIN_MODELS, id);
  }

  getAll(): Observable<any[]> {
    return this.getRequest(environment.TRAIN_MODELS);
  }

  getById(id: string): Observable<any> {
    return this.getRequest(environment.TRAIN_MODELS + '/' + id);
  }

  initModel(): Observable<any> {
    return this.getRequest(
      environment.INIT_TRAIN_MODEL + '/' + this.getActionContext()
    );
  }

  trainModel(model: any): Observable<any> {
    return this.postRequest(environment.TRAIN_MODEL, model);
  }

  reTrainModel(id: string): Observable<any> {
    return this.getRequest(environment.RETRAIN_MODEL + '/' + id);
  }

  save(model: any): Observable<any> {
    return undefined;
  }

  update(model: any): Observable<any> {
    return undefined;
  }
}
