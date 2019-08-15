import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseBotComponent } from '../../common/baseBot.component';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActionService } from '../../../service/action.service';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { BIZ_BOTS_CONSTANTS } from '../../../model/Constants';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends BaseBotComponent implements OnInit, OnDestroy {

  actionForm: FormGroup;
  validationRules: any;
  validationRuleSubscription: Subscription;
  actionSubscription: Subscription;
  actionModel: any;

  constructor(injector: Injector, private actionService: ActionService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    super(injector);
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('add') > -1) {
        this.currentAction = 'add';
        this.initActionModel();
        this.enableBackButton();
      } else if (path.indexOf('edit') > -1) {
        this.currentAction = 'edit';
        this.initActionCategory();
      }
    });
  }

  private initActionCategory() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateActionRule').subscribe(rules => {
        this.validationRules = rules;
        this.actionSubscription = this.actionService.getById(id).subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private initActionModel() {
    this.validationRuleSubscription = this.validationService.
      getValidationRuleMetadata('validateActionRule').subscribe(rules => {
        this.validationRules = rules;
        this.actionSubscription = this.actionService.initModel().subscribe((model) => {
          this.createForm(model);
        });
      });
  }

  private createForm(model: any) {
    this.actionModel = model;
    this.actionForm = this.autoGenFormGroup(this.actionModel, this.validationRules);
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.actionForm);

    if (this.actionForm.valid) {
      const finalModel = this.actionForm.value;
      this.actionService.save(finalModel).subscribe(res => {
        if (this.currentAction === 'add') {
          this.router.navigate(['/dashboard']);
        } else {
          this.actionForm = null;
          this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_ACTIONS_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_ACTIONS_SEARCH_RESULTS);
        }
      });
    }
  }

  revert() {
    if (this.actionModel) {
      this.actionForm = this.autoGenFormGroup(this.actionModel, this.validationRules);
    }
  }

  delete(id: string) {
    this.actionService.delete(id).subscribe(() => {
      this.notificationService.notify('Refresh Results!', BIZ_BOTS_CONSTANTS.REFRESH_ACTIONS_SEARCH_RESULTS,
            BIZ_BOTS_CONSTANTS.REFRESH_ACTIONS_SEARCH_RESULTS);
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  getResourceLocal(key: string) {
    return this.getResource('refData', key);
  }

}
