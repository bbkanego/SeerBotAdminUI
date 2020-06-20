import {CrudService} from 'seerlogics-ngui-components';

export abstract class BaseBotCrudService extends CrudService<any> {
  private actionContext: string;

  public setActionContext(context: string) {
    this.actionContext = context;
  }

  public getActionContext() {
    return this.actionContext;
  }

  public setSessionStorageItem(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  public getSessionStorageItem(key) {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
