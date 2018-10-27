import { Component, OnInit } from '@angular/core';
import {HttpClient} from 'my-component-library';
import { IntentService } from '../../service/intent.service';

@Component({
  selector: 'app-maintain-intents',
  templateUrl: './maintain-intents.component.html',
  styleUrls: ['./maintain-intents.component.css']
})
export class MaintainIntentsComponent implements OnInit {

  constructor(private httpClient: HttpClient, private intentService: IntentService) { }

  ngOnInit() {
    // this.httpClient.get()
  }

}
