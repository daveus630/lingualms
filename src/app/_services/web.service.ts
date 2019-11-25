import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { EmployeeLeaveData } from '../my-team/employee-leave.model';

@Injectable()
export class WebService {
  private API_URL = environment.BASE_API_URL;
  lists: any[] = [];
  constructor(public http: HttpClient) {}

  getAgentProfile(agentId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + 'agents/getAgentById/' + agentId);
  }

  getAllAgentsLeaveData() {
    return this.http.get<EmployeeLeaveData[]>(
      this.API_URL + 'agents/getAgentsCalendar'
    );
  }

  getAllHolidays(year: string): any {
    const params = new HttpParams().set('hub', 'MNL').set('year', year);
    return this.http.get<any[]>(this.API_URL + 'holidays/getAllHolidays', {
      params
    });
  }

  getDraftLeaveRequests(agentId: string): Observable<any> {
    return this.http.get<any>(this.API_URL + 'agents/draft/' + agentId);
  }

  deleteLeaveRequest(reqId: string, agentId: string): Observable<string> {
    const params = new HttpParams().set('agentId', agentId).set('refId', reqId);
    return this.http.delete<string>(this.API_URL + 'agents/draft/cancel', {
      params
    });
  }
}
