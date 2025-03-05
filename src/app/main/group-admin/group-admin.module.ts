import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupAdminRoutingModule } from './group-admin-routing.module';
import { GroupAdminsComponent } from './group-admins/group-admins.component';
import { AddUpdateGroupAdminComponent } from './add-update-group-admin/add-update-group-admin.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [GroupAdminsComponent, AddUpdateGroupAdminComponent],
  imports: [
    CommonModule,
    GroupAdminRoutingModule,
    SharedModule
  ]
})
export class GroupAdminModule { }
