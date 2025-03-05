import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServicesComponent } from './services/services.component';
import { AddUpdateServiceComponent } from './add-update-service/add-update-service.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ServicesComponent, AddUpdateServiceComponent],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    SharedModule
  ]
})
export class ServiceModule { }
