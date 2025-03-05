import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateQuickReplyComponent } from './add-update-quick-reply/add-update-quick-reply.component';
import { QuickRepliesComponent } from './quick-replies/quick-replies.component';

const routes: Routes = [
  {
    path: '',
    component: QuickRepliesComponent,
  },
  {
    path: 'add',
    component: AddUpdateQuickReplyComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateQuickReplyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickReplyRoutingModule {}
