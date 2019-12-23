import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Response} from '@angular/http';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {UUID} from 'angular2-uuid';
import * as $ from 'jquery';
import {
  BaseDynamicComponent,
  ChatData,
  ConfirmChatComponent,
  HttpClient,
  ModalComponent,
  Notification,
  OptionsChatComponent,
  StompService,
  TableChatComponentComponent,
  TextChat2ComponentComponent
} from 'my-component-library';
import {Subscription} from 'rxjs/Subscription';
import {BotService} from '../../../service/bot.service';
import {BaseBotComponent} from '../../common/baseBot.component';

/**
 * https://bootsnipp.com/snippets/ZlkBn
 */
@Component({
  selector: 'app-launch-bot',
  templateUrl: './test-bot.component.html',
  styleUrls: ['./test-bot.component.css']
})
export class TestBotComponent extends BaseBotComponent
  implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  botServiceSubscription: Subscription;
  launchDTO: any;
  botAccessUrl: string;
  botUniqueId: string;
  chatApiUrl: string;
  botAllowedOrigin: string;
  createButtonLabel = 'NONE';
  context = 'startTest';
  botCallSub: Subscription;
  trainedModelSelectValue;

  clickedColumn: any;
  localMessageJSON: any;
  localEventSubscription: Subscription;
  @ViewChild('chatbox')
  chatBox: ElementRef;
  @ViewChild('chatMessageBoxContainer')
  chatMessageBoxContainer: ElementRef;
  @ViewChild('messageListContainer')
  messageListContainer: ElementRef;
  @ViewChild('messageList', {read: ViewContainerRef})
  messageList: ViewContainerRef;
  private dynamicComponentMap: Map<number, ComponentRef<{}>> = new Map();
  private dynamicComponentCount = 0;

  private stompSubscription: any;
  private headers = {};
  private chatSessionId;
  private previousChatId;
  private currentSessionId;
  private scrollToTheBottom = false;
  private initiateMessageSent = false;
  private messageSide = 'left';
  private uniqueClientId;
  private botId;
  @ViewChild('stopBotModal') testBotModal: ModalComponent;
  @ViewChild('launchBotModal') launchBotModal: ModalComponent;

  @Input()
  hostUrl: string;
  @Input()
  subscriptionUrl: string;
  chatMessages: ChatData[] = new Array();

  constructor(
    injector: Injector,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private botService: BotService,
    private httpClient: HttpClient,
    private stomp: StompService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(injector);
  }

  private DYNAMIC_COMPONENTS = {
    text: TextChat2ComponentComponent,
    table: TableChatComponentComponent,
    confirmAction: ConfirmChatComponent,
    options: OptionsChatComponent
  };
  componentRef: ComponentRef<{}>;

  readonly DEFAULT_EXTERNAL_CONFIG = {
    loadCollapsed: false
  };

  readonly INTERNAL_CONFIG = {
    defaultNetworkTimeout: 30000
  };

  ngOnInit() {
    this.activatedRoute.url.subscribe((urlSegment: UrlSegment[]) => {
      this.loadBot();
    });

    this.localEventSubscription = this.notificationService
      .onNotification()
      .subscribe((eventObj: Notification) => {
        if (eventObj.subscriberType === 'clickAndSendResponse') {
          this.clickAndSendResponse(eventObj);
        } else if (eventObj.subscriberType === 'performYesNoAction') {
          this.performYesNoAction(eventObj);
        } else if (eventObj.subscriberType === 'deleteChildComponent') {
          this.deleteChildComponent(eventObj);
        }
      });
    this.uniqueClientId = UUID.UUID();
    // this.connect();
  }

  loadBot() {
    this.context = 'startTest';
    this.createButtonLabel = this.commonService.cmsContent[
      'launchBot'
      ].startLaunch.launchNowButton;
    this.botId = this.activatedRoute.snapshot.paramMap.get('id');
    this.botServiceSubscription = this.botService
      .startLaunchBot(this.botId)
      .subscribe(model => {
        this.launchDTO = model;
        if (this.launchDTO.bot.configurations.length > 0) {
          this.botAccessUrl = this.launchDTO.bot.configurations[0].url;
          this.botUniqueId = this.launchDTO.bot.configurations[0].uniqueBotId;
          this.botAllowedOrigin = this.launchDTO.bot.configurations[0].allowedOrigins;
          this.chatApiUrl = this.launchDTO.bot.configurations[0].url;
        } else if (this.launchDTO.bot.launchInfo.length > 0) {
          this.botAccessUrl = this.launchDTO.bot.launchInfo[0].chatUrl;
          this.botUniqueId = this.launchDTO.bot.launchInfo[0].uniqueBotId;
          this.botAllowedOrigin = this.launchDTO.bot.launchInfo[0].allowedOrigins;
          this.chatApiUrl = this.launchDTO.bot.launchInfo[0].chatUrl;
        }
        if (this.launchDTO.bot.status.code === 'TESTING') {
          this.context = 'launched';
          this.sendPingMessage();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.botServiceSubscription) {
      this.botServiceSubscription.unsubscribe();
    }
    if (this.botCallSub) {
      this.botCallSub.unsubscribe();
    }

    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
    }

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    if (this.localEventSubscription) {
      this.localEventSubscription.unsubscribe();
    }
  }

  isDisabled() {
    return (
      !this.trainedModelSelectValue || this.trainedModelSelectValue === 'NONE'
    );
  }

  cancel() {
    this.context = null;
    this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
  }

  getPageHeader() {
    const statusCode = this.launchDTO.bot.status.code;
    if (statusCode === 'DRAFT') {
      return this.commonService.cmsContent['launchBot'].startLaunch.pageHeading;
    } else if (statusCode === 'TESTING') {
      return this.commonService.cmsContent['launchBot'].test.pageHeading;
    }
    return this.commonService.cmsContent['launchBot'].launched.pageHeading;
  }

  getCancelButtonLabel() {
    if (this.context === 'launched') {
      return this.commonService.cmsContent['commonMessages'].okButton;
    }
    return this.commonService.cmsContent['commonMessages'].cancelButton;
  }

  showStopBot() {
    this.testBotModal.show();
  }

  showLaunchBotModal() {
    this.launchBotModal.show();
  }

  stopBot() {
    this.testBotModal.hide();
    this.botService.stopBot(this.botId).subscribe(() => {
      this.router.navigate(['/admin/init_search_bot'], {queryParams: {'action': 'launchBot'}});
    });
  }

  launchBot() {
    this.launchBotModal.hide();
    this.botService.launchBot(this.launchDTO.bot).subscribe(() => {
      this.router.navigate(['/admin/test_start', this.launchDTO.bot.id], {relativeTo: this.activatedRoute});
    });
  }

  getHeader() {
    const statusCode = this.launchDTO.bot.status.code;
    if (statusCode === 'DRAFT') {
      return this.commonService.cmsContent['launchBot'].startLaunch.testBotMessage;
    } else if (statusCode === 'TESTING') {
      return this.commonService.cmsContent['launchBot'].test.message;
    }
    return this.commonService.cmsContent['launchBot'].launched.botLaunchedMessage;
  }

  private deleteChildComponent(eventObj: Notification) {
    const childComponent: ComponentRef<{}> = this.dynamicComponentMap.get(
      +eventObj.message
    );
    childComponent.destroy();
    this.dynamicComponentMap.delete(+eventObj.message);
  }

  private performYesNoAction(eventObj: Notification) {
    if (this.clickedColumn && eventObj.message.response === 'yes') {
      this.sendMessageGeneral(
        eventObj.message.messageJSON.yesResponse +
        '|' +
        this.clickedColumn.clickItemId,
        false
      );
      this.clickedColumn = null;
    } else if (this.clickedColumn && eventObj.message.response === 'no') {
      this.sendMessageGeneral(eventObj.message.messageJSON.noResponse, false);
      this.clickedColumn = null;
    }
  }

  private clickAndSendResponse(eventObj: Notification) {
    this.clickedColumn = eventObj.message;
    const message: ChatData = {
      id: null,
      message: eventObj.message.clickResponse,
      chatSessionId: this.chatSessionId,
      accountId: null,
      previousChatId: this.previousChatId,
      currentSessionId: this.currentSessionId,
      uniqueClientId: this.uniqueClientId,
      response: '',
      authCode: this.botUniqueId,
    };
    this.sendPostMessage(this.botAccessUrl, message);
  }

  sendPingMessage() {
    this.initiateMessageSent = true;
    const message: ChatData = {
      id: null,
      message: 'Initiate',
      accountId: '',
      chatSessionId: 'NONE',
      previousChatId: null,
      currentSessionId: null,
      uniqueClientId: this.uniqueClientId,
      response: '',
      authCode: this.botUniqueId,
    };
    this.sendPostMessage(this.botAccessUrl, message);
    /* this.httpClient
      .post(this.botAccessUrl, JSON.stringify(message))
      .map((res: Response) => res.json())
      .subscribe(data => {}); */
  }

  sendMessage() {
    this.sendMessageGeneral(this.chatBox.nativeElement.value, true);
  }

  sendMessageGeneral(messageStr: string, appendRequest: boolean) {
    const message: ChatData = {
      id: null,
      message: messageStr,
      chatSessionId: this.chatSessionId,
      accountId: null,
      previousChatId: this.previousChatId,
      currentSessionId: this.currentSessionId,
      uniqueClientId: this.uniqueClientId,
      authCode: this.botUniqueId,
      response: ''
    };

    message.accountId = 'Admin';
    message.chatSessionId = UUID.UUID();
    // message.previousChatId = 1;
    message.uniqueClientId = UUID.UUID();

    if (appendRequest) {
      this.chatMessages.push(message);
      this.appendChatRequest(message);
    }

    this.sendPostMessage(this.botAccessUrl, message);
  }

  private sendPostMessage(botAccessUrl: string, message: {}) {
    const inputHeaders = [
      {
        name: 'Access-Control-Allow-Credentials',
        value: 'true'
      },
      {
        name: 'X-Customer-Origin',
        value: this.botAllowedOrigin
      },
      {
        name: 'X-Bot-Id',
        value: this.botUniqueId
      }
    ];

    this.httpClient
      .post(botAccessUrl, JSON.stringify(message), inputHeaders)
      .map((res: Response) => res.json())
      .subscribe(data => {
        this.chatBox.nativeElement.value = '';
        this.handleResponse(data);
      });
  }

  connect() {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      this.stompSubscription = this.stomp.subscribe(
        this.subscriptionUrl + '/' + this.uniqueClientId,
        this.handleResponse.bind(this),
        this.headers
      );
      this.sendPingMessage();
    });
  }

  // response
  private handleResponse(data: ChatData) {
    // console.log('data received = ' + JSON.stringify(data));
    this.chatMessages.push(data);
    this.appendChatResponse(data);
    this.chatSessionId = data.chatSessionId;
    this.previousChatId = data.id;
    this.currentSessionId = data.currentSessionId;
    this.scrollToTheBottom = true;
    if (this.chatBox) {
      this.chatBox.nativeElement.focus();
    }
  }

  ngAfterViewChecked() {
    if (this.scrollToTheBottom) {
      this.scrollToBottom();
      this.scrollToTheBottom = false;
    }
  }

  ngAfterViewInit(): void {

  }

  scrollToBottom(): void {
    if (this.messageListContainer) {
      const $messageListContainerObj = $(
        this.messageListContainer.nativeElement
      );
      $messageListContainerObj.animate(
        {scrollTop: $messageListContainerObj.prop('scrollHeight')},
        300
      );
      // this.messageListContainer.nativeElement.scrollTop = this.messageListContainer.nativeElement.scrollHeight;
    }
  }

  appendChatRequest(data: ChatData) {
    const contextData = {
      chatData: data,
      message: data.message
    };
    this.createDynamicComponent('text', contextData);
  }

  appendChatResponse(data: ChatData) {
    let message = data.message;
    if (data.accountId === 'ChatBot') {
      message = data.response;
    }
    const messageJSON = JSON.parse(message);
    console.log('The widget name is = ' + messageJSON.widget);
    if (messageJSON.widget === 'text') {
      this.processTextWidget(messageJSON, data);
    } else if (messageJSON.widget === 'table') {
      this.processTableWidget(messageJSON, data);
    } else if (messageJSON.widget === 'confirmAction') {
      this.processConfirmAction(messageJSON, data);
    } else if (messageJSON.widget === 'options') {
      this.processOptionsAction(messageJSON, data);
    }
  }

  private processTextWidget(messageJSON, data: ChatData) {
    const contextData = {
      chatData: data,
      message: messageJSON.content
    };
    this.createDynamicComponent('text', contextData);
  }

  private processTableWidget(messageJSON, data: ChatData) {
    this.localMessageJSON = messageJSON;
    const contextData = {
      chatData: data,
      message: messageJSON
    };
    this.createDynamicComponent('table', contextData);
  }

  private processConfirmAction(messageJSON, data: ChatData) {
    const contextData = {
      chatData: data,
      message: messageJSON
    };
    this.createDynamicComponent('confirmAction', contextData);
  }

  private processOptionsAction(messageJSON, data: ChatData) {
    const contextData = {
      chatData: data,
      message: messageJSON
    };
    this.createDynamicComponent('options', contextData);
  }

  private createDynamicComponent(type, contextData) {
    if (type) {
      this.dynamicComponentCount++;
      const componentType = this.DYNAMIC_COMPONENTS[type];

      const factory = this.componentFactoryResolver.resolveComponentFactory(
        componentType
      );
      this.componentRef = this.messageList.createComponent(factory);

      // supply extra information
      const componentInstance = <BaseDynamicComponent>(
        this.componentRef.instance
      );
      componentInstance.context = contextData;
      componentInstance.id = this.dynamicComponentCount;

      this.dynamicComponentMap.set(
        this.dynamicComponentCount,
        this.componentRef
      );
    }
  }

  onKeydownEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  getResourceLocal(key: string) {
    return this.getResource('launchBot', key);
  }

  isBotLaunched() {
    return this.launchDTO.bot.status.code === 'LAUNCHED';
  }

  isBotInTesting() {
    return this.launchDTO.bot.status.code === 'TESTING';
  }
}
