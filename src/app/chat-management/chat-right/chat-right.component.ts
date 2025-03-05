
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ConfigurationService, HttpRequestService } from 'src/app/core/services';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { SocketDispatcherService } from 'src/app/core/services/socket-dispatcher.service';

@Component({
  selector: 'app-chat-right',
  templateUrl: './chat-right.component.html',
  styleUrls: ['./chat-right.component.scss']
})
export class ChatRightComponent implements OnInit {
  selectedUser: any = {};
  nameCapitalized = '';
  newMessage = '';
  user: any = {};
  messages: any[] = [];
  mediaUploadUrl: string;
  mediaId = null;
  mediaUrl = '';
  mediaOrginalName = '';
  mediaType = '';
  typing$: Subject<boolean> = new Subject<boolean>();
  userTyping = '';
  typingUser: any;
  subscriptions: Subscription[] = [];
  mediaBaseUrl = '';
  replyMessage: any = null;
  roomId = '';
  constructor(
    private communicationService: CommunicationService,
    private socketDispatcherService: SocketDispatcherService,
    private requesterService: HttpRequestService,
    private configurationService: ConfigurationService,
    private msg: NzMessageService,
    private route: ActivatedRoute
  ) {
    this.mediaUploadUrl = configurationService.apiUrl + '/api/media';
    this.mediaBaseUrl =  this.configurationService.mediaBaseUrl;
   }

  ngOnInit(): void {
    console.log('Some');
    this.route.queryParams.subscribe(p => {
      if (p.user && p.room) {
        this.roomId = p.room;
        this.getUserById(p.user);
        this.subscriptions.map(x => x.unsubscribe());
        this.init();
      }
    });
  }

  init(): void {
    this.subscriptions.push(
      this.typing$
      .pipe(
        tap(value => {
          this.socketDispatcherService.sendMessage('typingStatus', {chatroom: this.roomId, typing:  true});
        }),
        debounceTime(800)
      ).subscribe(() => {
        this.socketDispatcherService.sendMessage('typingStatus', {chatroom: this.roomId, typing:  false});
      })
    );

    this.subscriptions.push(
      this.socketDispatcherService.getMessage('typing_' + this.roomId).subscribe(data => {
        this.userTyping = data.typing;
        this.typingUser = data.user;
      })
    );
  }

   /** Media */
   customRequestHeaders = () => {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }

  beforeVideoUpload = (
    file: NzUploadFile,
    fileList: NzUploadFile[]
  ): Observable<any> => {
    return new Observable((observer: Observer<boolean>) => {

      const isLt2M = file.size ? file.size / 1024 / 1024 < 26 : false;
      if (!isLt2M) {
        this.msg.error('Video must smaller than 25MB!');
        observer.complete();
        return;
      }
      observer.next( isLt2M);
      observer.complete();
    });
  }

  getUserById(userId: string): void {
    this.requesterService.request('get', `users/${userId}`).subscribe(data => {
      this.user = data.data;
      if (this.user.chatroom) {
        this.messages = [];
        this.getChatMessages();
      }
      this.selectedUser = data.data;
      this.nameCapitalized = this.selectedUser.name.charAt(0).toUpperCase();
    });
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () =>
      callback(reader.result ? reader.result.toString() : '')
    );
    reader.readAsDataURL(img);
  }

  handleUploadExplainVideo(
    info: { file: NzUploadFile }
  ): void {
    switch (info.file.status) {
      case 'uploading':
        break;
      case 'done':
        this.mediaId = info.file.response.data._id;
        this.mediaType = info.file.response.data.mimetype;
        this.mediaOrginalName = info.file.response.data.originalname;
        // Get this url from response in real world.
        if (info.file && info.file.originFileObj) {
          this.getBase64(info.file.originFileObj, (file: string) => {
            this.mediaUrl = file;
          });
        }
        break;
      case 'error':
        this.msg.error('Network error');
        break;
    }
  }

  getChatMessages(): void {
    this.requesterService
      .request('get', 'messages/' + this.roomId, {skip: 0, limit: 50})
      .subscribe((response) => {
        this.messages = response.data;
        // this.updateScroll();
        this.readMessages();
      });
  }

  readMessages(): void {
    this.requesterService
      .request('post', `messages/${this.roomId}/read-messages`)
      .subscribe((response) => {
        this.communicationService.readMessage.next(this.roomId);
      });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() && !this.mediaId) {
      return;
    }
    this.socketDispatcherService
      .sendMessage('newMessage', {
        media: this.mediaId,
        message: this.newMessage,
        chatroom: this.roomId,
        replyTo: this.replyMessage && this.replyMessage._id
      })
      .then((data) => {
        this.messages = [ ...this.messages, { ...data, type: 'me' }];
        this.newMessage = '';
        this.mediaId = null;
        this.mediaUrl = '';
        this.replyMessage = null;
      });
  }

  // reply item
  replyItem(item: any): void {
    this.replyMessage = item;
  }

}
