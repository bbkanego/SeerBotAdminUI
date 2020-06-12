      import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/frozenEnvironment';
import { BaseBotCrudService } from './baseBotCrud.service';

@Injectable()
export class RoleService extends BaseBotCrudService {
    searchCriteriaModel: any;

    constructor(injector: Injector) {
        super(injector);
    }

    initModel(): Observable<any> {
        return this.getRequest(environment.SAVE_ROLE_URL + '/init');
    }

    setSearchCriteriaModel(model) {
        this.searchCriteriaModel = model;
    }

    getSearchCriteriaModel() {
         return this.searchCriteriaModel;
    }

    save(model: any): Observable<any> {
        return this.postRequest(environment.SAVE_ROLE_URL, model);
    }

    delete(id: string): Observable<any> {
        return this.deleteRequest(environment.SAVE_ROLE_URL, id);
    }

    update(model: any): Observable<any> {
        return this.postRequest(environment.SAVE_ROLE_URL, model);
    }

    getById(id: string): Observable<any> {
        return this.getRequest(environment.SAVE_ROLE_URL + '/' + id);
    }

    getAll(): Observable<any[]> {
        return this.getRequest(environment.SAVE_ROLE_URL);
    }
}
