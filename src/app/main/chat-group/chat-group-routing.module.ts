import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateChatGroupComponent } from './add-update-chat-group/add-update-chat-group.component';
import { ChatGroupsComponent } from './chat-groups/chat-groups.component';

const routes: Routes = [
  {
    path: '',
    component: ChatGroupsComponent
  },
  {
    path: 'add',
    component: AddUpdateChatGroupComponent
  },
  {
    path: 'update/:id',
    component: AddUpdateChatGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatGroupRoutingModule { }
