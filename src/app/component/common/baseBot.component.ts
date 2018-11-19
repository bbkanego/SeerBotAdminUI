import { BaseReactiveComponent, CommonService } from 'my-component-library';
import { Injector } from '@angular/core';

export abstract class BaseBotComponent extends BaseReactiveComponent {
  currentAction = 'add';
  protected commonService: CommonService;
  constructor(injector: Injector) {
    super(injector);
    this.commonService = injector.get(CommonService);
  }

  getCommonResources(key) {
    return this.commonService.cmsContent['commonMessages'][key];
  }

  getResource(context, key) {
    const resources = this.commonService.cmsContent[context];
    if (this.currentAction === 'add') {
      return resources.addBot[key];
    } else if (this.currentAction === 'edit') {
      return resources.editBot[key];
    }
  }
}
