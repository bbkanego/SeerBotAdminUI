import {NgModule} from '@angular/core';
import {TrainModelComponent} from './train-model/train-model.component';
import {SearchModelComponent} from './search-model/search-model.component';
import {NlpModelRoutingModule} from './nlp-model-routing.module';
import {NlpModelService} from '../../service/nlp-model.service';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ButtonModule, DataTableModule, InputModule} from 'seerlogics-ngui-components';

@NgModule({
  imports: [NlpModelRoutingModule, CommonModule, ReactiveFormsModule, DataTableModule, ButtonModule, InputModule],
  declarations: [TrainModelComponent, SearchModelComponent],
  providers: [NlpModelService]
})
export class NlpModelModule {

}
