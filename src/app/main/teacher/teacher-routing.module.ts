import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateTeacherComponent } from './add-update-teacher/add-update-teacher.component';
import { TeachersComponent } from './teachers/teachers.component';

const routes: Routes = [
  {
    path: '',
    component: TeachersComponent,
  },
  {
    path: 'add',
    component: AddUpdateTeacherComponent,
  },
  {
    path: 'update/:id',
    component: AddUpdateTeacherComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
