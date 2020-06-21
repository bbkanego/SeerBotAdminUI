import {Component, ElementRef, Injector, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {IntentService} from '../../../service/intent.service';
import {BaseBotComponent} from '../../common/baseBot.component';
import {DashboardService, SearchBotsTransactions} from '../../../service/dashboard.service';
import {Option} from 'seerlogics-ngui-components';
import {BotDetail, ReTrainBot, UtteranceToIntent} from '../../../model/models';

declare var $;

@Component({
  selector: 'app-retrain-bot',
  templateUrl: './re-train-bot.component.html',
  styleUrls: ['./re-train-bot.component.css']
})
export class ReTrainBotComponent extends BaseBotComponent implements OnInit, OnDestroy {

  intentsForm: FormGroup;
  botTransactions: any[];
  availableIntents: Map<string, any> = new Map();
  currentIntents: Option[];
  botDetail;
  matchingBot: BotDetail;
  validationRules: any;
  validationRuleSubscription: Subscription;
  botServiceSubscription: Subscription;
  catModel: any;
  matchType: string = null;
  @ViewChild('toolTip') toolTip: ElementRef;
  @ViewChild('messageTrained') messageTrained: ElementRef;
  private allBotsTransactionSubscription: Subscription;

  constructor(injector: Injector, private intentService: IntentService, private dashboardService: DashboardService,
              private activatedRoute: ActivatedRoute, private localRouter: Router) {
    super(injector);
  }

  get utteranceToIntents(): FormArray {
    return this.intentsForm.get('utteranceToIntents') as FormArray;
  }

  ngOnInit() {

    this.validationRuleSubscription = this.validationService
      .getValidationRuleMetadata('validateAssociateIntent').subscribe(rules => {
        this.validationRules = rules;
      });

    this.botTransactions = this.dashboardService.allBotsTransactionData;
    if (!this.botTransactions) {
      this.regetTransactions();
    }
    this.botDetail = this.dashboardService.botDetail;

    // in case of redirect from dashboard do the below
    this.activatedRoute.queryParams.subscribe((params) => {
      const transactionId = +params['botId'];
      const type = params['type'];
      if (transactionId && type) {
        this.manageUtteranceAndIntents(transactionId, type);
      }
    });
  }

  regetTransactions() {
    const searchBotsTransactions: SearchBotsTransactions = {transactionMaybe: null, transactionSuccess: null};
    this.sendGetAllBotsTransactionsCall(searchBotsTransactions);
  }

  sendGetAllBotsTransactionsCall(searchBotsTransactions: SearchBotsTransactions) {
    this.allBotsTransactionSubscription = this.dashboardService.getAllBotsTransactions(searchBotsTransactions)
      .subscribe(result => {
        this.botTransactions = result;
      });
  }

  ngOnDestroy(): void {
    if (this.validationRuleSubscription) {
      this.validationRuleSubscription.unsubscribe();
    }
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
    if (this.allBotsTransactionSubscription) {
      this.allBotsTransactionSubscription.unsubscribe();
    }
  }

  onSubmit() {
    this.markFormGroupTouched(this.intentsForm);

    if (this.intentsForm.valid) {
      const reTrainBot: ReTrainBot = this.intentsForm.value;
      reTrainBot.botId = this.matchingBot.id;
      reTrainBot.categoryCode = this.matchingBot.categoryCode;
      this.intentService.associateIntents(reTrainBot).subscribe(res => {
        this.regetTransactions();
        this.intentsForm = null;
        this.showToast(this.messageTrained);
      });
    }
  }

  revert() {
    if (this.catModel) {
      this.intentsForm = this.autoGenFormGroup(this.catModel, this.validationRules);
    }
  }

  cancel() {
    this.intentsForm = null;
  }

  getResourceLocal(key: string) {
    return this.getResource('maintainBot', 'reTrainBot.' + key);
  }

  manageUtteranceAndIntents(botId, type: string) {
    if (!this.botTransactions) {
      return;
    }

    const matchingBotArr = this.botTransactions.filter(bot => {
      return bot.id === botId;
    });

    this.matchType = type;

    this.matchingBot = matchingBotArr[0];

    if (this.availableIntents.get(this.matchingBot.categoryCode) === undefined) {
      this.intentService.getIntentsByCategoryCode(this.matchingBot.categoryCode).subscribe(intents => {
        this.availableIntents.set(this.matchingBot.categoryCode, this.buildOptionsLocal(intents));
        this.currentIntents = this.availableIntents.get(this.matchingBot.categoryCode);

        this.buildIntentsForm(type, this.matchingBot);
      });
    } else {
      this.currentIntents = this.availableIntents.get(this.matchingBot.categoryCode);
      this.buildIntentsForm(type, this.matchingBot);
    }
  }

  onCheckBoxSelected(selectedValue) {
    console.log(selectedValue);
  }

  localHelp() {
    this.help();
  }

  protected buildOptionsLocal(referenceData): Option[] {
    const optionsObj: Option[] = [];
    optionsObj.push(new Option('_NONE_', 'None'));
    optionsObj.push(new Option('-999999', '-- Ignore transaction --'));
    for (const entry of referenceData) {
      if (!entry.intent.includes('Maybe')) {
        optionsObj.push(new Option(entry.id, entry.intent));
      }
    }
    return optionsObj;
  }

  private buildIntentsForm(type: string, matchingBot: BotDetail) {

    const reTrainBot: ReTrainBot = {};
    if ('failed' === type) {
      reTrainBot.utteranceToIntents = this.populateUtteranceToIntents(matchingBot.failureTransactions);
    } else if ('success' === type) {
      reTrainBot.utteranceToIntents = this.populateUtteranceToIntents(matchingBot.successTransactions);
    } else if ('maybe' === type) {
      reTrainBot.utteranceToIntents = this.populateUtteranceToIntents(matchingBot.maybeTransactions);
    }

    this.intentsForm = this.autoGenFormGroup(reTrainBot, this.validationRules);
  }

  private populateUtteranceToIntents(trans: any[]) {
    const utteranceToIntents: UtteranceToIntent[] = [];
    trans.forEach(transaction => {
      if (!transaction.resolved && !transaction.ignore) {
        utteranceToIntents.push({
          transactionId: transaction.id,
          utterance: transaction.utterance,
          intentId: transaction.intentId,
          matchedIntent: transaction.intent
        });
      }
    });
    return utteranceToIntents;
  }
}
