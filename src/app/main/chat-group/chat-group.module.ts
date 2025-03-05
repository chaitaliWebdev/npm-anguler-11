import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatGroupRoutingModule } from './chat-group-routing.module';
import { ChatGroupsComponent } from './chat-groups/chat-groups.component';
import { AddUpdateChatGroupComponent } from './add-update-chat-group/add-update-chat-group.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ChatGroupsComponent, AddUpdateChatGroupComponent],
  imports: [
    CommonModule,
    ChatGroupRoutingModule,
    SharedModule
  ]
})
export class ChatGroupModule { }
