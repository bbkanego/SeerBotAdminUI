import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {throwError as _throw} from 'rxjs';
import {BotAdminCommonService} from '../service/common.service';
import {CommonModalModel} from '../app.component';

@Injectable()
export class InterceptHttpInterceptor implements HttpInterceptor {

  constructor(private botAdminCommonService: BotAdminCommonService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.headers.has('Content-Type')) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    request = request.clone({headers: request.headers.set('Accept', 'application/json')});

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };

        if (data.status === 400) {
          const commonModalData: CommonModalModel = {header: 'Test', bodyMessage: data.reason, buttonOk: 'Close'};
          this.botAdminCommonService.showCommonModal(commonModalData);
          // this.errorDialogService.openDialog(data);
        }
        return _throw(error);
      }));
  }
}
