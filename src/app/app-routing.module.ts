import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './my-profile/my-profile.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { LeaveRequestComponent } from './requests/leave-request/leave-request.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'gtech/dashboard',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'gtech/myteams',
    component: MyTeamComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'gtech/requests',
    component: LeaveRequestComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'gtech/home',
    component: HomeComponent
  }, {
    path: '',
    redirectTo: '/gtech/dashboard',
    pathMatch: 'full'
  }, {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

