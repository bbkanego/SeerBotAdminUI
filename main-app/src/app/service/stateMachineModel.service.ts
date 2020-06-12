import { Injectable, Injector } from '@angular/core';
import { BaseBotCrudService } from './baseBotCrud.service';
import { Observable } from 'rxjs';
import { environment } from '../environments/frozenEnvironment';

@Injectable()
export class StateMachineService extends BaseBotCrudService {
  constructor(injector: Injector) {
    super(injector);
  }

  getXML(url: string): Observable<any> {
    return this.getRequest(url);
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

  save(model: any): Observable<any> {
    return undefined;
  }

  update(model: any): Observable<any> {
    return undefined;
  }
}
