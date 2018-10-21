import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, NgModel } from '@angular/forms';
import { BaseReactiveComponent } from 'my-component-library';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  dashboardForm;

  validationRules;
  @ViewChild('formDir') formObj: NgModel;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
