import { Injectable, Injector } from '@angular/core';
import { CrudService } from 'my-component-library';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IntentService extends CrudService<any> {

    constructor(injector: Injector) {
        super(injector);
    }

    public initModel(): Observable<any> {
        return this.getRequest(environment.INIT_ACCOUNT_URL);
    }

    public save(model: any): Observable<any> {
        return this.postRequest(environment.SAVE_ACCOUNT_URL, model);
    }

    public delete(id: string): Observable<any> {
        return this.deleteRequest(environment.SAVE_ACCOUNT_URL, id);
    }

    public update(model: any): Observable<any> {
        throw new Error('Not implemented yet.');
    }

    public getById(id: string): Observable<any> {
        return this.getRequest(environment.SAVE_ACCOUNT_URL + '/' + id);
    }

    public getAll(): Observable<any[]> {
        return this.getRequest(environment.SAVE_ACCOUNT_URL);
    }

}
