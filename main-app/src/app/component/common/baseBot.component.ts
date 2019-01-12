import { Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseReactiveComponent, CommonService } from 'my-component-library';
import {combineLatest} from 'rxjs/observable/combineLatest';

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

  // https://kamranahmed.info/blog/2018/02/28/dealing-with-route-params-in-angular-5/
  protected getUrlParams(activatedRoute: ActivatedRoute) {
    // Combine them both into a single observable
    const urlParams = combineLatest(activatedRoute.params, activatedRoute.queryParams,
      (params, queryParams) => ({ ...params, ...queryParams })
    );
  }
}
