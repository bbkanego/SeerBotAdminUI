import {Directive, ElementRef, Injector} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseReactiveComponent, CommonService, Option} from 'my-component-library';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {FormGroup} from '@angular/forms';

@Directive({selector: 'app-base-comp'})
export class BaseBotComponent extends BaseReactiveComponent {
  currentAction = 'add';
  showIntentFileUpload = false;

  protected commonService: CommonService;
  private baseRouter: Router;

  constructor(injector: Injector) {
    super(injector);
    this.baseRouter = injector.get(Router);
    this.commonService = injector.get(CommonService);
  }

  getCommonResources(key: string) {
    return this.getResource('commonMessages', key);
  }

  getResource(context: string, key: string) {
    const resources = this.commonService.cmsContent[context];
    if (key.indexOf('.') !== -1) {
      const keys: string[] = key.split('.');
      let value = resources;
      keys.forEach(item => {
        value = value[item];
      });
      return value;
    } else {
      return resources[key];
    }
  }

  // https://kamranahmed.info/blog/2018/02/28/dealing-with-route-params-in-angular-5/
  protected getUrlParams(activatedRoute: ActivatedRoute) {
    // Combine them both into a single observable
    const urlParams = combineLatest(
      activatedRoute.params,
      activatedRoute.queryParams,
      (params, queryParams) => ({...params, ...queryParams})
    );
  }

  protected mapSelectValue(
    form: FormGroup,
    model,
    formControlName: string,
    referenceDataProp: string
  ) {
    const selectedCat = form.get(formControlName).value;
    const targetCat = model.referenceData[referenceDataProp].filter(
      (element: any) => element.code === selectedCat
    );
    form.get(formControlName).setValue(targetCat[0]);
  }

  protected buildOptions(referenceData: [{ code: ''; name: '' }]): Option[] {
    const optionsObj: Option[] = [];
    optionsObj.push(new Option('_NONE_', 'None'));
    for (const entry of referenceData) {
      optionsObj.push(new Option(entry.code, entry.name));
    }
    return optionsObj;
  }

  protected showToast(element: ElementRef) {
    const toastObj = $(element.nativeElement);
    toastObj.addClass('show');
    setTimeout(function () {
      toastObj.removeClass('show');
    }, 5000);
  }

  protected help() {
    this.baseRouter.navigate(['/help']);
  }
}
