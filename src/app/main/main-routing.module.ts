import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'service',
    loadChildren: () =>
      import('./service/service.module').then((m) => m.ServiceModule),
  },
  {
    path: 'chat-group',
    loadChildren: () =>
      import('./chat-group/chat-group.module').then((m) => m.ChatGroupModule),
  },
  {
    path: 'group-admin',
    loadChildren: () =>
      import('./group-admin/group-admin.module').then(
        (m) => m.GroupAdminModule
      ),
  },
  {
    path: 'teacher',
    loadChildren: () =>
      import('./teacher/teacher.module').then((m) => m.TeacherModule),
  },
  {
    path: 'quick-reply',
    loadChildren: () =>
      import('./quick-reply/quick-reply.module').then(
        (m) => m.QuickReplyModule
      ),
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./students/students.module').then((m) => m.StudentsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
