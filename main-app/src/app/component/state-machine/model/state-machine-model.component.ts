import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StateMachineService} from '../../../service/stateMachineModel.service';
import {Http, RequestOptions, ResponseContentType} from '@angular/http';
import {InjectionNames, Modeler, OriginalPaletteProvider} from '../bpmn-js/bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {CustomPaletteProvider} from './props-provider/CustomPaletteProvider';

const customModdle = {
  name: 'customModdle',
  uri: 'http://example.com/custom-moddle',
  prefix: 'custom',
  xml: {
    tagAlias: 'lowerCase'
  },
  associations: [],
  types: [
    {
      name: 'ExtUserTask',
      extends: ['bpmn:UserTask'],
      properties: [
        {
          name: 'worklist',
          isAttr: true,
          type: 'String'
        }
      ]
    }
  ]
};

/**
 * https://raw.githubusercontent.com/narve/angular-bpmn/master/src/app/app.component.ts
 */
@Component({
  selector: 'seeradmin-state-machine-model',
  templateUrl: './state-machine-model.component.html',
  styleUrls: ['./state-machine-model.component.css']
})
export class StateMachineComponent
  implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('editModel') editModel: ElementRef;
  @ViewChild('properties') properties: ElementRef;
  private modeler: BpmnModeler;
  private diagramXML = '../../../../assets/diagram/newDiagram.bpmn';
  private viewer;

  constructor(
    private stateMachineService: StateMachineService,
    private localHttp: Http
  ) {
  }

  ngOnInit(): void {
    this.modeler = new Modeler({
      additionalModules: [
        // Re-use original palette, see CustomPaletteProvider
        {
          [InjectionNames.originalPaletteProvider]: [
            'type',
            OriginalPaletteProvider
          ]
        },
        {[InjectionNames.paletteProvider]: ['type', CustomPaletteProvider]}
      ]
    });

    this.modeler.attachTo(this.editModel.nativeElement);

    this.load();
  }

  load(): void {
    const options = new RequestOptions({
      responseType: ResponseContentType.Text
    });
    this.localHttp.get(this.diagramXML, options).subscribe(x => {
      console.log('Fetched XML, now importing: ', x.text());
      this.modeler.importXML(x.text(), this.handleError);
    }, this.handleError);
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  ngAfterContentInit(): void {
  }

  ngOnDestroy(): void {
    // destroy BpmnJS instance
    this.modeler.destroy();
  }
}
