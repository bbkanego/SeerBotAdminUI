import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/frozenEnvironment';
import { BaseBotCrudService } from './baseBotCrud.service';

@Injectable()
export class ResourceService extends BaseBotCrudService {
    searchCriteriaModel: any;

    constructor(injector: Injector) {
        super(injector);
    }

    initModel(): Observable<any> {
        return this.getRequest(environment.SAVE_RESOURCE_URL + '/init');
    }

    initSearchModel(): Observable<any> {
        return this.getRequest(environment.SAVE_RESOURCE_URL);
    }

    setSearchCriteriaModel(model) {
        this.searchCriteriaModel = model;
    }

    getSearchCriteriaModel() {
        return this.searchCriteriaModel;
    }

    searchResource(): Observable<any> {
        return this.getRequest(environment.SAVE_RESOURCE_URL);
    }

    save(model: any): Observable<any> {
        return this.postRequest(environment.SAVE_RESOURCE_URL, model);
    }

    delete(id: string): Observable<any> {
        return this.deleteRequest(environment.SAVE_RESOURCE_URL, id);
    }

    update(model: any): Observable<any> {
        return this.postRequest(environment.SAVE_RESOURCE_URL, model);
    }

    getById(id: string): Observable<any> {
        return this.getRequest(environment.SAVE_RESOURCE_URL + '/' + id);
    }

    getAll(): Observable<any[]> {
        return this.getRequest(environment.SAVE_RESOURCE_URL);
    }
}
