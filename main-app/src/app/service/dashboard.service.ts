import { CrudService } from 'my-component-library';
import { BaseBotCrudService } from './baseBotCrud.service';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class DashboardService extends BaseBotCrudService {

    constructor(injector: Injector) {
        super(injector);
    }

    initModel(): Observable<any> {
        throw new Error('Method not implemented.');
    }

    save(model: any): Observable<any> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Observable<any> {
        throw new Error('Method not implemented.');
    }
    update(model: any): Observable<any> {
        throw new Error('Method not implemented.');
    }
    getById(id: string): Observable<any> {
        throw new Error('Method not implemented.');
    }
    getAll(): Observable<any[]> {
        throw new Error('Method not implemented.');
    }


};