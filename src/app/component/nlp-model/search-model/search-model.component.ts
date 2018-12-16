import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NlpModelService} from "../../../service/nlp-model.service";
import {CommonService} from "my-component-library";

@Component({
  selector: 'app-search-model',
  templateUrl: './search-model.component.html',
  styleUrls: ['./search-model.component.css']
})
export class SearchModelComponent implements OnInit {

  modelResults;

  constructor(injector: Injector, private activatedRoute: ActivatedRoute, private nlpService: NlpModelService,
              private router: Router, private commonService: CommonService) {
  }

  ngOnInit() {
    this.nlpService.getAll().subscribe(results => {
      this.modelResults = results;
    });
  }

}
