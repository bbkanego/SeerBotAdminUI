import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, NgModel, FormControl } from '@angular/forms';
import { BaseReactiveComponent } from 'my-component-library';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  dashboardForm: FormGroup;

  validationRules;
  @ViewChild('formDir') formObj: NgModel;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.dashboardForm = new FormGroup({
      name: new FormControl(),
      description: new FormControl()
    });
  }

  ngOnDestroy(): void {
  }

}
