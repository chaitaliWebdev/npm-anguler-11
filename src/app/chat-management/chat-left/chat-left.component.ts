import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigurationService, HttpRequestService } from 'src/app/core/services';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { SocketDispatcherService } from 'src/app/core/services/socket-dispatcher.service';

@Component({
  selector: 'app-chat-left',
  templateUrl: './chat-left.component.html',
  styleUrls: ['./chat-left.component.scss']
})
export class ChatLeftComponent implements OnInit, OnDestroy {
  loading = false;
  users: any[] = [];
  activeUserId = '';
  activeRoomId = '';
  subscriptions: Subscription[] = [];
  onlineUsers: string[] = [];
  mediaBaseUrl = '';
  nameSearch = '';
  constructor(
    private httpRequestService: HttpRequestService,
    private socketDispatcherService: SocketDispatcherService,
    private configurationService: ConfigurationService,
    private router: Router,
    private route: ActivatedRoute,
    private communicationService: CommunicationService,

  ) { }

  ngOnInit(): void {
    this.mediaBaseUrl = this.configurationService.mediaBaseUrl;
    this.getChatRooms(true);
    this.socketDispatcherService.authenticate();
    this.subscriptions.push(
      this.socketDispatcherService.getMessage('onlineUsers').subscribe(response => {
          this.onlineUsers = response;
          this.getChatRooms();
      })
    );
    this.subscriptions.push(
      this.socketDispatcherService.getMessage('newMessage').subscribe(message => {
        this.getChatRooms();
      })
    );
    this.communicationService.readMessage.subscribe(data => {
      const userIndex = this.users.indexOf((x: any) => x._id === data);
      if (userIndex > 0) {
        this.users[userIndex].unreadCount = 0;
      }
    });
    this.route.queryParams.subscribe(p => {
      if (p.user) {
        this.activeUserId = p.user;
        this.activeRoomId = p.room;
      }
    });
  }

  getChatRooms(init = false): void {
    this.httpRequestService.request('get', 'chatrooms').subscribe(data => {
      this.users = data.data;
      let selectUser;
      let roomId;
      if (this.users.length && init) {
        if (this.route.snapshot.queryParams.user) {
          selectUser = this.route.snapshot.queryParams.user;
          roomId = this.route.snapshot.queryParams.room;
        }else {
          selectUser = this.users[0].user._id;
          roomId = this.users[0]._id;
        }
        this.selectUser(selectUser, roomId);
      }
    }, err => {

    });
  }

  selectUser(value: any, roomId: any): void {
    if (roomId !== this.activeRoomId) {
      this.activeRoomId = roomId;
      this.router.navigateByUrl(`chat?user=${value}&room=${roomId}`);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

}
