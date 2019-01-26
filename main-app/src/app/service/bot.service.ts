import {Injectable, Injector} from '@angular/core';
import {CrudService} from 'my-component-library';
import {Observable} from 'rxjs/Observable';

import {environment} from '../environments/environment';

export class LaunchBot {
  constructor(private bot: any, private trainedModelId: number) {}
}

@Injectable()
export class BotService extends CrudService<any> {

  constructor(injector: Injector) {
    super(injector);
  }

  public initModelByType(type: string): Observable<any> {
    return this.getRequest(environment.INIT_BOT + type);
  }

  public initModel(): Observable<any> {
    throw new Error('Not implemented. Use the initModelByType method');
  }

  public save(model: any): Observable<any> {
    return this.postRequest(environment.SAVE_BOT, model);
  }

  public delete(id: string): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public update(model: any): Observable<any> {
    throw new Error('Not implemented yet.');
  }

  public getById(id: string): Observable<any> {
    return this.getRequest(environment.GET_BOT + '/' + id);
  }

  public getAll(): Observable<any[]> {
    return this.getRequest(environment.ALL_BOTS);
  }

  public launchBot(launchBot: LaunchBot): Observable<any> {
    return this.postRequest(environment.LAUNCH_BOT, launchBot);
  }

  public startLaunchBot(id: string): Observable<any> {
    return this.getRequest(environment.START_LAUNCH_BOT + '/' + id);
  }

  public stopBot(id: string): Observable<any> {
    return this.getRequest(environment.STOP_BOT + '/' + id);
  }

  public terminateBot(id: string): Observable<any> {
    return this.getRequest(environment.TERMINATE_BOT + '/' + id);
  }

  public changeBotStatus(id: string, status: string): Observable<any> {
    return this.getRequest(environment.CHANGE_BOT_STATUS + '/' + id + '/' + status);
  }
}