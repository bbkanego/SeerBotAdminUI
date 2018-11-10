import { CrudService } from 'my-component-library';
import { Observable } from 'rxjs/Observable';
import { environment } from '../environments/environment';


export class BotService extends CrudService<any> {
    public initModel(): Observable<any> {
        return this.getRequest(environment.INIT_BOT);
    }

    public save(model: any): Observable<any> {
        return this.postRequest(environment.ALL_INTENTS, model);
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
