import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NlpModelService} from "../../../service/nlp-model.service";
import {CommonService, NotificationService} from "my-component-library";
import {BIZ_BOTS_CONSTANTS} from "../../../model/Constants";

@Component({
  selector: 'app-search-model',
  templateUrl: './search-model.component.html',
  styleUrls: ['./search-model.component.css']
})
export class SearchModelComponent implements OnInit {

  modelResults;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute, private nlpService: NlpModelService,
              private router: Router, private commonService: CommonService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getAllResults();

    this.notificationService.onNotification().subscribe((data: any) => {
      if (data.subscriberType === BIZ_BOTS_CONSTANTS.REFRESH_MODELS_SEARCH_RESULTS) {
        this.getAllResults();
      }
    });
  }

  private getAllResults() {
    this.nlpService.getAll().subscribe(results => {
      this.modelResults = results;
    });
  }

  viewModel(id) {
    this.router.navigate(['./view/' + id], { relativeTo: this.activatedRoute })
  }

  getResource(context) {
    return this.commonService.cmsContent[context];
  }

}
