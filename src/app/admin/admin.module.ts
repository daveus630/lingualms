import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';

import { AdminComponent } from './admin/admin.component';

import { AdminRoutingModule } from './admin-routing.module';

import { AlertComponent } from '../_directives/alert.component';
import { ModifyEmployeeComponent } from './employee/modifyEmployee/modify-employee.component';
import { AddEmployeeComponent } from './employee/addEmployee/add-employee.component';
import { SupervisorComponent } from './supervisors/supervisor.component';
import { ProjectComponent } from './projects/project.component';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { EmployeeComponent } from './employee/employee.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AdminRoutingModule,
  ],
  declarations: [
    AdminComponent,
    AlertComponent,
    EmployeeComponent,
    AddEmployeeComponent,
    ModifyEmployeeComponent,
    PendingRequestsComponent,
    SupervisorComponent,
    ProjectComponent,
  ],
  providers: [],
  exports: [AlertComponent]
})
export class AdminModule { }
