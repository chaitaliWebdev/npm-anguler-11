import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickReplyRoutingModule } from './quick-reply-routing.module';
import { AddUpdateQuickReplyComponent } from './add-update-quick-reply/add-update-quick-reply.component';
import { QuickRepliesComponent } from './quick-replies/quick-replies.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddUpdateQuickReplyComponent, QuickRepliesComponent],
  imports: [CommonModule, QuickReplyRoutingModule, SharedModule],
})
export class QuickReplyModule {}
