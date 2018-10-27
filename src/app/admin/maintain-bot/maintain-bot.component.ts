import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { FormGroup, NgModel } from '@angular/forms';
import { CustomFormControl } from 'my-component-library';
import { BaseReactiveComponent } from 'my-component-library';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-maintain-bot',
  templateUrl: './maintain-bot.component.html',
  styleUrls: ['./maintain-bot.component.css']
})
export class MaintainBotComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  dashboardForm: FormGroup;

  validationRules;
  @ViewChild('formDir') formObj: NgModel;
  createButtonLabel = 'Create Bot';

  constructor(injector: Injector, private activatedRoute: ActivatedRoute, private router: Router) {
    super(injector);
  }

  ngOnInit() {
    this.dashboardForm = new FormGroup({
      name: new CustomFormControl(),
      description: new CustomFormControl()
    });

    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      this.initComponent(path);
      if (path.indexOf('detail') > -1) {
        this.enableBackButton();
      }
    });
  }

  private initComponent(path: string): void {
    console.log('EventComponent path is = ' + path);
  }

  ngOnDestroy(): void {
  }
}
