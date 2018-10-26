import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { BaseReactiveComponent, CustomFormControl } from 'my-component-library';
import { FormGroup, NgModel } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  dashboardForm: FormGroup;

  validationRules;
  @ViewChild('formDir') formObj: NgModel;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.dashboardForm = new FormGroup({
      name: new CustomFormControl(),
      description: new CustomFormControl()
    });
  }

  ngOnDestroy(): void {
  }

}
