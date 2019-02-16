import { CrudService } from 'my-component-library';

export abstract class BaseBotCrudService extends CrudService<any> {
  private actionContext: string;

  public setActionContext(context: string) {
    this.actionContext = context;
  }

  public getActionContext() {
    return this.actionContext;
  }
}
