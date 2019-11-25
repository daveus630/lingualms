import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { ShiftChange } from './shift-change-requests/shift-change';
import { LeaveRequest } from './leave-request/leave-request';
import { LeaveHistory } from './leave-history/leave-history';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private API_URL = environment.BASE_API_URL + 'requests/';

  constructor(public http: HttpClient) {}

  submitShiftChangeRequest(value: ShiftChange) {
    return this.http.post<ShiftChange>(
      this.API_URL + 'applyshiftchange',
      value
    );
  }

  submitLeaveRequest(value: LeaveRequest) {
    return this.http.post<LeaveRequest>(this.API_URL + 'applyLeave', value);
  }

  getLeaveHistory(agentId: string): Observable<LeaveHistory[]> {
    return this.http.get<LeaveHistory[]>(
      this.API_URL + 'getRequestsByAgentId/' + agentId
    );
  }

  getLeaveTypes(): Observable<{ name: string }> {
    return this.http.get<{ name: string }>(this.API_URL + 'getAllLeaveType');
  }

  cancelLeaveRequest(agent: string, refNumber: any) {
    const params = new HttpParams()
      .set('agentId', agent)
      .set('refNumber', refNumber);
    return this.http.delete<string>(this.API_URL + 'cancelLeaveRequest', {
      params
    });
  }
}
