import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError as _throw} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {BotAdminCommonService} from '../service/common.service';
import {CommonModalModel} from '../app.component';
import {NotificationService, SUBSCRIBER_TYPES, UtilsService} from 'seerlogics-ngui-components';

@Injectable()
export class InterceptHttpInterceptor implements HttpInterceptor {

  constructor(private botAdminCommonService: BotAdminCommonService, private notificationService: NotificationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.headers.has('Content-Type')) {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    const currentUser = JSON.parse(UtilsService.getCurrentUser());
    if (currentUser && currentUser.token) {
      request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + currentUser.token)});
    }

    request = request.clone({headers: request.headers.set('Accept', 'application/json')});

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };

        if (data.status === 401) {
          this.notificationService.notify('Session Expired', 'Session Expired',
            SUBSCRIBER_TYPES.FORCE_LOGOUT);
        }

        if (data.status === 400) {
          const commonModalData: CommonModalModel = {header: 'Test', bodyMessage: data.reason, buttonOk: 'Close'};
          this.botAdminCommonService.showCommonModal(commonModalData);
          // this.errorDialogService.openDialog(data);
        }
        return _throw(error);
      }));
  }
}
