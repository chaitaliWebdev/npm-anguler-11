import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarLayoutComponent } from './sidebar-layout/sidebar-layout.component';
import { NoSidebarLayoutComponent } from './no-sidebar-layout/no-sidebar-layout.component';
import { SidebarComponent } from './elements/sidebar/sidebar.component';
import { HeaderComponent } from './elements/header/header.component';
import { FooterComponent } from './elements/footer/footer.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';

@NgModule({
  declarations: [
    SidebarLayoutComponent,
    NoSidebarLayoutComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    ChatLayoutComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
})
export class LayoutModule {}
