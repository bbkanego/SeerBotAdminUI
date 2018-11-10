import { Injectable } from '@angular/core';
import { HttpClient } from 'my-component-library';
import { environment } from '../environments/environment';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BotCommonService {
  messages: {} = null;

  constructor(private http: Http, private httpClient: HttpClient) {}

  /**
   * unsubscribing to observables created by angular's http service is not needed
   * https://stackoverflow.com/questions/40861494/angular2-unsubscribe-from-http-observable-in-service
   */
  getMessages(): void {
    if (this.messages == null) {
      this.getMessagesLocal().subscribe((incomingMessages: any) => {
        this.messages = incomingMessages;
      });
    }
  }

  /**
   * @returns {any}
   */
  private getMessagesLocal(): Observable<any> {
    return (
      this.httpClient
        .get(environment.ALL_MESSAGES_URL)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }
}
