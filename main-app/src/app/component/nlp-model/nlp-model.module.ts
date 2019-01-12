import {NgModule} from '@angular/core';
import {TrainModelComponent} from './train-model/train-model.component';
import {SearchModelComponent} from './search-model/search-model.component';
import {NlpModelRoutingModule} from './nlp-model-routing.module';
import {NlpModelService} from '../../service/nlp-model.service';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonUtilsModule} from 'my-component-library';

@NgModule({
  imports:[NlpModelRoutingModule, CommonModule, ReactiveFormsModule, CommonUtilsModule],
  declarations: [TrainModelComponent, SearchModelComponent],
  providers:[NlpModelService]
})
export class NlpModelModule {

}
