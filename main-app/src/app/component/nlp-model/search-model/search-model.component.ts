import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NlpModelService} from '../../../service/nlp-model.service';
import {BIZ_BOTS_CONSTANTS} from '../../../model/Constants';
import {BaseBotComponent} from '../../common/baseBot.component';

@Component({
  selector: 'seeradmin-search-model',
  templateUrl: './search-model.component.html',
  styleUrls: ['./search-model.component.css']
})
export class SearchModelComponent extends BaseBotComponent implements OnInit {

  modelResults;

  private activatedRoute: ActivatedRoute;

  constructor(injector: Injector, private localRouter: Router, activatedRoute: ActivatedRoute,
              private nlpService: NlpModelService) {
    super(injector);
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
    this.getAllResults();

    this.notificationService.onNotification().subscribe((data: any) => {
      if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS) {
        this.getAllResults();
      }
    });
  }

  viewModel(id) {
    this.localRouter.navigate(['./view/' + id], {relativeTo: this.activatedRoute});
  }

  getResourceLocal(context) {
    return this.commonService.cmsContent[context];
  }

  localHelp() {
    this.help();
  }

  private getAllResults() {
    this.nlpService.getAll().subscribe(results => {
      this.modelResults = results;
    });
  }

}
