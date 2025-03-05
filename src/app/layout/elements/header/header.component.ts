import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AuthService,
  HttpRequestService,
  LocalStorageService,
} from 'src/app/core/services';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CommunicationService } from 'src/app/core/services/communication.service';
import { NotificationDrawerComponent } from '../../../shared/notification-drawer/notification-drawer.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SocketDispatcherService } from 'src/app/core/services/socket-dispatcher.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isCollapsed = false;
  notificationSelectedClass = false;
  profileSelectedClass = false;
  selectedCommunity = '';
  showCommunity = false;
  user: any = {};
  isChatUrl = false;
  @Input() unreadCount = 0;
  // communityId: string;
  userInfo = [
    {
      title: 'My profile',
    },
    {
      title: 'Settings',
    },
    {
      title: 'Logout',
    },
  ];
  @Output() collapsed: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private authService: AuthService,
    private httpRequestService: HttpRequestService,
    private notificationService: NzNotificationService,
    private localStorageService: LocalStorageService,
    private drawerService: NzDrawerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isChatUrl = this.router.url.includes('/chat');

    this.user = this.localStorageService.getItem('user');
  }
  onChangeCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapsed.emit(this.isCollapsed);
  }

  logout(): void {
    this.httpRequestService
      .request('delete', 'auth/logout')
      .subscribe((success) => {
        this.notificationService.success(
          'Success',
          'You Successfully Logged out'
        );
      });
    this.authService.logout();
  }

  openNotificationComponent(): void {
    const drawerRef = this.drawerService.create<
      NotificationDrawerComponent,
      { value: null },
      string
    >({
      nzTitle: 'Notifications',
      nzContent: NotificationDrawerComponent,
      nzWidth: 350,
      nzContentParams: {
        value: null,
      },
    });

    drawerRef.afterOpen.subscribe(() => {});

    drawerRef.afterClose.subscribe((data) => {});
  }


}
