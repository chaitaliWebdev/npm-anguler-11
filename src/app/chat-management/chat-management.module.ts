import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatManagementRoutingModule } from './chat-management-routing.module';
import { ChatMainComponent } from './chat-main/chat-main.component';
import { ChatLeftComponent } from './chat-left/chat-left.component';
import { ChatRightComponent } from './chat-right/chat-right.component';
import { ChatBodyComponent } from './chat-body/chat-body.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [ChatMainComponent, ChatLeftComponent, ChatRightComponent, ChatBodyComponent],
  imports: [
    CommonModule,
    ChatManagementRoutingModule,
    SharedModule,
    ScrollingModule
  ]
})
export class ChatManagementModule { }
