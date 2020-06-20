import {Injectable} from '@angular/core';
import {CommonModalModel} from '../app.component';
import {NotificationService} from 'seerlogics-ngui-components';
import {BIZ_BOTS_CONSTANTS} from '../model/Constants';

@Injectable()
export class BotAdminCommonService {

  constructor(private notificationService: NotificationService) {
  }

  showCommonModal(modalData: CommonModalModel) {
    this.notificationService.notifyAny(modalData, BIZ_BOTS_CONSTANTS.SHOW_COMMON_MODEL,
      BIZ_BOTS_CONSTANTS.SHOW_COMMON_MODEL);
  }
}
