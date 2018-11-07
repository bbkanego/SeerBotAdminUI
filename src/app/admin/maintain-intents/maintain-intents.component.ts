import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { IntentService } from '../../service/intent.service';
import { BaseReactiveComponent } from 'my-component-library';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-maintain-intents',
  templateUrl: './maintain-intents.component.html',
  styleUrls: ['./maintain-intents.component.css']
})
export class MaintainIntentsComponent extends BaseReactiveComponent implements OnInit, OnDestroy {
  allIntents;
  intentsForm: FormGroup;
  private intentsSubscription: Subscription;

  constructor(injector: Injector, private intentService: IntentService) {
    super(injector);
  }

  private createForm() {
    this.intentsForm = this.autoGenFormGroup(
      this.allIntents, null);
  }

  ngOnInit() {
    this.intentsSubscription = this.intentService.getAll().subscribe((response: any[]) => {
      this.allIntents = response;
      this.createForm();
    });
  }

  ngOnDestroy(): void {
    if (this.intentsSubscription) {
      this.intentsSubscription.unsubscribe();
    }
  }
}
