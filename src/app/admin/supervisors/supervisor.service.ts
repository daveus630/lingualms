import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Supervisor } from './supervisor';
import { PendingRequest } from '../pending-requests/pending-requests';

@Injectable({ providedIn: 'root' })
export class SupervisorService {
  private API_URL = environment.BASE_API_URL + 'supervisors/';

  constructor(private http: HttpClient) {}

  getSupervisors(): Observable<Supervisor[]> {
    return this.http.get<Supervisor[]>(this.API_URL + 'getAllSupervisor');
  }

  deleteSupervisor(supervisorId: string): Observable<string> {
    return this.http.delete<string>(this.API_URL + 'delete/' + supervisorId);
  }

  addSupervisor(value: Supervisor) {
    return this.http.post<Supervisor[]>(this.API_URL + 'add', value);
  }

  getPendingRequests(supervisorId: string): Observable<PendingRequest[]> {
    return this.http.get<PendingRequest[]>(
      this.API_URL + 'reqlist/' + supervisorId
    );
  }

  actionRequests(
    action: string,
    agent: string,
    supervisorId: string,
    ref: string,
    requestType: string
  ) {
    const params = new HttpParams()
      .set('action', action)
      .set('agent', agent)
      .set('supervisor', supervisorId)
      .set('ref', ref)
      .set('type', requestType);
    return this.http.get<string>(this.API_URL + 'acknowledge', { params });
  }
}
