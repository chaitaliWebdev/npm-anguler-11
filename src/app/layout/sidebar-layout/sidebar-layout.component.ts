import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { HttpRequestService } from 'src/app/core/services';
import { SocketDispatcherService } from 'src/app/core/services/socket-dispatcher.service';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss'],
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isChatUrl = false;
  unreadCount = 0;
  unreadCountSubscription: Subscription | null = null;
  constructor(
    private socketDispatcherService: SocketDispatcherService,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('sidebar');
    this.isChatUrl = this.router.url.includes('/chat');
    this.router.events.subscribe((val) => {
      if (val) {

        this.isChatUrl = this.router.url.includes('/chat');
      }
    });
    this.getUnreadMessages();
    this.unreadCountSubscription = this.socketDispatcherService
    .getMessage('unreadCount')
    .subscribe((count) => {
      this.unreadCount = count;
      if (!this.isChatUrl) {
        this.notificationService.success(
          'New Message',
          'You have a new message'
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
  }
  onCollapseChange(value: any): void {
    this.isCollapsed = value;

  }

  getUnreadMessages(): void {
    this.httpRequestService
      .request('get', `messages/unread-count`)
      .subscribe((data) => {
        this.unreadCount = data.data;
      });
  }
}
