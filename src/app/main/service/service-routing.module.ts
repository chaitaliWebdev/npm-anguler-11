import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateServiceComponent } from './add-update-service/add-update-service.component';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesComponent
  },
  {
    path: 'add',
    component: AddUpdateServiceComponent
  },
  {
    path: 'update/:id',
    component: AddUpdateServiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
