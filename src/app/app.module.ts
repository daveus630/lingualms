import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiDatePickerComponent } from './requests/leave-request/multi-date-picker/multi-date-picker';
import {
  MatTableModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavHeaderComponent } from './nav/nav-header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LeaveRequestComponent } from './requests/leave-request/leave-request.component';
import { MyTeamComponent } from './my-team/my-team.component';
import { LeaveHistoryComponent } from './requests/leave-history/leave-history.component';
import { ProfileComponent } from './my-profile/my-profile.component';

import { WebService } from './_services/web.service';
import { AuthService } from './auth/auth.service';
import { AlertService } from './_services/alert.service';
import { CalendarComponent } from './_directives/calendar/calendar.component';
import { ShiftChangeComponent } from './requests/shift-change-requests/shift-change.component';
import { RequestComponent } from './requests/request/request.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavHeaderComponent,
    PageNotFoundComponent,
    LeaveRequestComponent,
    MyTeamComponent,
    LeaveHistoryComponent,
    ProfileComponent,
    CalendarComponent,
    ShiftChangeComponent,
    RequestComponent,
    MultiDatePickerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AdminModule,
    AuthModule,
    AppRoutingModule
  ],
  providers: [WebService, AuthService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule {}
