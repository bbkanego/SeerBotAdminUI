import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';
import { ResourceService } from '../../../service/resource.service';
import { BaseBotComponent } from '../../common/baseBot.component';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.css']
})
export class ResourceComponent extends BaseBotComponent implements OnInit, OnDestroy {

  resourceForm: FormGroup;
  validationRules: any;
  validationRuleSubscription: Subscription;
  resourceSubscription: Subscription;
  resourceModel: any;

  constructor(injector: Injector, private resourceService: ResourceService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add') > -1) {
        this.currentAction = 'add';
        this.initResourceModel();
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.initEditResource();
      }
    });
  }

  private initEditResource() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateResourceRule').subscribe(rules => {
        this.validationRules = rules;
        this.resourceSubscription = this.resourceService.getById(id).subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private initResourceModel() {
    this.validationRuleSubscription = this.validationService.
      getValidationRuleMetadata('validateResourceRule').subscribe(rules => {
        this.validationRules = rules;
        this.resourceSubscription = this.resourceService.initModel().subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private createForm(model: any) {
    this.resourceModel = model;
    this.resourceForm = this.autoGenFormGroup(this.resourceModel, this.validationRules);
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.resourceForm);

    if (this.resourceForm.valid) {
      const finalModel = this.resourceForm.value;
      this.resourceService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.resourceForm = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_RESOURCES_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_RESOURCES_SEARCH_RESULTS);
        }
      });
    }
  }

  revert() {
    if (this.resourceModel) {
      this.resourceForm = this.autoGenFormGroup(this.resourceModel, this.validationRules);
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getResourceLocal(key: string) {
    return this.getResource('refData', key);
  }

}
