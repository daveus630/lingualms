import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { AdminComponent } from './admin/admin.component';
import { ProjectComponent } from './projects/project.component';
import { SupervisorComponent } from './supervisors/supervisor.component';
import { PendingRequestsComponent } from './pending-requests/pending-requests.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { EmployeeComponent } from './employee/employee.component';

const adminRoutes: Routes = [
  {
    path: 'gtech/admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'leavestype', component: PageNotFoundComponent },
          { path: 'holidays', component: PageNotFoundComponent },
          { path: 'project', component: ProjectComponent },
          { path: 'supervisor', component: SupervisorComponent },
          { path: 'pendingapprovals', component: PendingRequestsComponent },
          { path: '', component: EmployeeComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
