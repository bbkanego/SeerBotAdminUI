import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {BaseReactiveComponent, Option, SUBSCRIBER_TYPES} from 'my-component-library';
import {Subscription} from 'rxjs/Subscription';
import {NlpModelService} from '../../../service/nlp-model.service';

@Component({
  selector: 'app-train-model',
  templateUrl: './train-model.component.html',
  styleUrls: ['./train-model.component.css']
})
export class TrainModelComponent extends BaseReactiveComponent implements OnInit, OnDestroy {

  trainModel: any;
  trainForm: FormGroup;
  private validationRules;
  currentAction = 'start';
  category = [];
  validationRuleSubscription: Subscription;
  botServiceSubscription: Subscription;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute, private nlpService: NlpModelService,
                    private router: Router) {
    super(injector);
  }

  private createForm(): void {
    this.trainForm = this.autoGenFormGroup(
      this.trainModel,
      this.validationRules
    );
  }

  private initComponent(): void {
    this.createForm();

    // prepare the drop downs.
    this.category = [];
    this.category.push(new Option('', 'None'));
    for (const entry of this.trainModel.referenceData.categories) {
      this.category.push(new Option(entry.code, entry.name));
    }
  }

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      const path = urlSegment.join('/');
      if (path.indexOf('start') > -1) {
        this.startTrain();
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
  }

  revert() {
    if (this.trainModel) {
      this.createForm();
      this.notificationService.notifyAny(this.trainForm, SUBSCRIBER_TYPES.FORM_GROUP_RESET,
        SUBSCRIBER_TYPES.FORM_GROUP_RESET);
    }
  }

  private startTrain() {
    this.currentAction = 'add';
    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateBotRule').subscribe(rules => {
        this.validationRules = rules;
        this.botServiceSubscription = this.nlpService.initModel().subscribe((model) => {
          this.trainModel = model;
          this.initComponent();
        });
      });
  }

  onSubmit(event) {

  }

}
