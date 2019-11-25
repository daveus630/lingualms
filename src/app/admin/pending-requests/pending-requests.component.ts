import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

import { AlertService } from '../../_services/alert.service';
import { AuthService } from 'src/app/auth/auth.service';

import { PendingRequest } from './pending-requests';
import { SupervisorService } from '../supervisors/supervisor.service';

declare var $: any;

@Component({
  selector: 'app-pending-requests',
  templateUrl: 'pending-requests.component.html',
  styleUrls: ['pending-requests.component.css']
})
export class PendingRequestsComponent implements OnInit {
  displayedColumns: string[] = [
    'refId',
    'status',
    'leaveHoursCount',
    'type',
    'requester',
    'reqDate',
    'action'
  ];
  dataSource = new MatTableDataSource();
  tempDataSource: PendingRequest[] = [];
  pendingRequests: PendingRequest[] = [];
  rowDetail: PendingRequest[] = [];
  supervisorsList: any[] = [];
  refIdColumn = 'refId';
  loggedUserID: string;
  isLoadingResults = false;
  isLoading = false;
  isUserAuthorized = false;
  isNoData = true;
  agent: string;
  ref: string;
  action: string;
  typeOfRequest = 'response';
  currentIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public supervisorService: SupervisorService,
    private alertService: AlertService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoadingResults = true;
    this.getSupervisors();
    this.loggedUserID = this.authService.email
      ? this.authService.email.split('@')[0]
      : null;
    this.supervisorService
      .getPendingRequests(this.loggedUserID)
      .subscribe(data => {
        this.pendingRequests = data['reqList'];
        // console.log(this.pendingRequests);
        this.isLoadingResults = false;
        this.dataSource = new MatTableDataSource(this.pendingRequests);
        setTimeout(() => (this.dataSource.paginator = this.paginator));
        if (this.dataSource.data.length > 0) {
          this.isNoData = false;
        }
      });
  }

  rejectRequest() {
    if (!this.rowDetail) {
      return;
    }
    const agent = this.rowDetail['requester'];
    const ref = this.rowDetail['refId'];
    const action = 'rejected';
    this.supervisorService
      .actionRequests(action, agent, this.loggedUserID, ref, this.typeOfRequest)
      .subscribe(
        data => {
          this.deleteRowDataTable(this.dataSource);
          this.alertService.success(data['message'], true);
        },
        error => {
          if (error.status === 404) {
            this.alertService.error('API not found');
          } else {
            this.alertService.error(error.error['message']);
          }
        }
      );
  }

  approveRequest() {
    if (!this.rowDetail) {
      return;
    }
    const agent = this.rowDetail['requester'];
    const ref = this.rowDetail['refId'];
    const action = 'approved';
    this.isLoading = true;
    this.supervisorService
      .actionRequests(action, agent, this.loggedUserID, ref, this.typeOfRequest)
      .subscribe(
        data => {
          this.isLoading = false;
          this.deleteRowDataTable(this.dataSource);
          this.alertService.success(data['message'], true);
        },
        error => {
          this.isLoading = false;
          if (error.status === 404) {
            this.alertService.error('Requested API not found');
          } else {
            this.alertService.error(error.error['message']);
          }
        }
      );
  }

  getRecord(value: PendingRequest[], index: number) {
    this.currentIndex = index;
    this.rowDetail = value;
    return this.rowDetail;
  }

  private deleteRowDataTable(dataSource) {
    console.log('deleteRow', this.currentIndex);
    dataSource.data.splice(this.currentIndex, 1);
    dataSource._updateChangeSubscription();
    if (dataSource.data.length <= 0) {
      this.isNoData = true;
    }
  }

  getSupervisors() {
    this.supervisorService.getSupervisors().subscribe(data => {
      this.supervisorsList = data['supervisors'];
      this.supervisorsList.forEach(element => {
        if (element['ldap'] === this.loggedUserID) {
          this.isUserAuthorized = true;
        }
      });
    });
  }
}
