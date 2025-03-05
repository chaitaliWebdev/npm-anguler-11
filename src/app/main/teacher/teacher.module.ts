import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { AddUpdateTeacherComponent } from './add-update-teacher/add-update-teacher.component';
import { TeachersComponent } from './teachers/teachers.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddUpdateTeacherComponent, TeachersComponent],
  imports: [CommonModule, TeacherRoutingModule, SharedModule],
})
export class TeacherModule {}
