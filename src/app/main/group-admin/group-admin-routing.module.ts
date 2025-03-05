import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateGroupAdminComponent } from './add-update-group-admin/add-update-group-admin.component';
import { GroupAdminsComponent } from './group-admins/group-admins.component';

const routes: Routes = [
  {
    path: '',
    component: GroupAdminsComponent
  },
  {
    path: 'add',
    component: AddUpdateGroupAdminComponent
  },
  {
    path: 'update/:id',
    component: AddUpdateGroupAdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupAdminRoutingModule { }
