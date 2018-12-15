import {NgModule} from '@angular/core';
import {TrainModelComponent} from './train-model/train-model.component';
import { SearchModelComponent } from './search-model/search-model.component';
import {NlpModelRoutingModule} from "./nlp-model-routing.module";
import {NlpModelService} from "../../service/nlp-model.service";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports:[NlpModelRoutingModule, CommonModule, ReactiveFormsModule],
  declarations: [TrainModelComponent, SearchModelComponent],
  providers:[NlpModelService]
})
export class NlpModelModule {

}
