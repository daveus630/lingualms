import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AuthService } from '../../auth/auth.service';
import { AlertService } from '../../_services/alert.service';
import { RequestService } from '../requests.service';

import { LeaveHistory } from './leave-history';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-leave-history',
  templateUrl: 'leave-history.component.html',
  styleUrls: ['leave-history.component.css']
})
export class LeaveHistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'refNumber',
    'appliedDate',
    'noOfHours',
    'leaveTitle',
    'leaveType',
    'status',
    'remarks',
    'approvedBy',
    'actionedOn',
    'action'
  ];
  dataSource = new MatTableDataSource();
  historyData: LeaveHistory[];
  rowDetail: LeaveHistory[] = [];
  leaveHistoryForm: FormGroup;
  isLoading = false;
  agentId: string;
  isNoData = false;
  isFutureDate = true;
  currentIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public requestService: RequestService,
    public alertService: AlertService
  ) { }

  ngOnInit() {
    this.agentId = this.authService.getAgentId();
    this.leaveHistoryForm = this.fb.group({
      statusRadio: ['All']
    });
    this.isLoading = true;
    this.requestService
      .getLeaveHistory(this.agentId)
      .pipe(
        map(data => {
          return {
            leaveHistoryData: data['data'].map(
              (leaveHistoryData: LeaveHistory) => {
                return {
                  reqId: leaveHistoryData.reqId,
                  date_applied: leaveHistoryData.date_applied,
                  title: leaveHistoryData.title,
                  type: leaveHistoryData.type,
                  status: leaveHistoryData.status,
                  remarks: leaveHistoryData.remarks,
                  approved_by: leaveHistoryData.approved_by,
                  actioned_on: leaveHistoryData.actioned_on,
                  leave_hours_count: leaveHistoryData.leave_hours,
                  isFutureDate: this.checkFutureDate(
                    leaveHistoryData.leave_Dates,
                    leaveHistoryData.status
                  )
                };
              }
            )
          };
        })
      )
      .subscribe(transformeddata => {
        this.historyData = transformeddata['leaveHistoryData'];
        this.dataSource = new MatTableDataSource(this.historyData);
        // Used set timeout because the paginator has issue in getting
        // the length value of array.
        setTimeout(() => (this.dataSource.paginator = this.paginator));
        if (this.dataSource.data.length) {
          this.isNoData = false;
        } else {
          this.isNoData = true;
        }
        this.isLoading = false;
      });
  }

  getHistoryByStatus(event: Event) {
    const eventValue = event.target['value'];
    if (eventValue !== 'All') {
      this.dataSource.filter = eventValue.trim().toUpperCase();
      this.dataSource.paginator = this.paginator;
      const isHistoryData = _.find(this.dataSource.data, [
        'status',
        this.dataSource.filter
      ]);
      if (isHistoryData) {
        this.isNoData = false;
      } else {
        this.isNoData = true;
      }
    }
    if (eventValue === 'All') {
      this.dataSource = new MatTableDataSource(this.historyData);
      this.dataSource.paginator = this.paginator;
      if (this.dataSource.data.length) {
        this.isNoData = false;
      } else {
        this.isNoData = true;
      }
    }
  }

  cancelLeaveRequest() {
    if (!this.rowDetail) {
      return;
    }
    const agent = this.agentId;
    const refNumber = this.rowDetail['reqId'];
    this.requestService.cancelLeaveRequest(agent, refNumber).subscribe(
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

  getRecord(value: LeaveHistory[], index: number) {
    this.currentIndex = index;
    this.rowDetail = value;
    return this.rowDetail;
  }

  deleteRowDataTable(dataSource) {
    dataSource.data.splice(this.currentIndex, 1);
    dataSource._updateChangeSubscription();
    if (dataSource.data.length <= 0) {
      this.isNoData = true;
    }
  }

  checkFutureDate(leaveDates: any[] = [], leaveStatus: string) {
    let counter = 0;
    const currentDate = moment();
    leaveDates.forEach(element => {
      const leaveDate = moment(element, 'MM-DD-YYYY');
      if (moment(leaveDate).isAfter(currentDate)) {
        counter++;
      }
    });
    if (counter > 0 && leaveStatus !== 'REJECTED') {
      return true;
    } else {
      return false;
    }
  }
}
