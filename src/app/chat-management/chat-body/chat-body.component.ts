import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { ConfigurationService, HttpRequestService } from 'src/app/core/services';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { SocketDispatcherService } from 'src/app/core/services/socket-dispatcher.service';

@Component({
  selector: 'app-chat-body',
  templateUrl: './chat-body.component.html',
  styleUrls: ['./chat-body.component.scss'],
})
export class ChatBodyComponent implements OnInit, OnDestroy, OnChanges {
  loading = false;
  user: any = {};
  roomId = '';
  @Input() messages: any[] = [];
  subscriptions: Subscription[] = [];
  @ViewChild('scrollItem', { static: false }) content: ElementRef | null = null;
  @Output() replyItem = new EventEmitter();
  @ViewChild('notificationTemp', { static: false }) template?: TemplateRef<{}>;
  mediaBaseUrl = '';
  constructor(
    private socketDispatcherService: SocketDispatcherService,
    private communicationService: CommunicationService,
    public configurationService: ConfigurationService,
    private route: ActivatedRoute,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.mediaBaseUrl = this.configurationService.mediaBaseUrl;
    this.route.queryParams.subscribe(p => {
      this.user = p.user;
      this.roomId = p.room;
    });
    this.subscriptions.push(
      this.socketDispatcherService.getMessage('newMessage').subscribe(message => {
        console.log(message);
        if (message.chatroom === this.roomId) {
          this.messages.push(message);
          this.updateScroll();
        }else {
          /* tslint:disable-next-line */
          this.notificationService.template(this.template!, { nzData: message});
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.

    if (changes.messages && this.messages.length) {
      this.updateScroll();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }



  updateScroll(): void {

    try {
      setTimeout(() => {
        if (this.content) {

          this.content.nativeElement.scrollTop =
            this.content.nativeElement.scrollHeight;
        }
      }, 100);
    } catch (err) {}
  }

  // reply message
  replyMesage(item: any): void {
    this.replyItem.emit(item);
  }

  getPdfUrl(url: string): string {
    return `https://docs.google.com/viewer?url=${url}&embedded=true"`;
  }
}
