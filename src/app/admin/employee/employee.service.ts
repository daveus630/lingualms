import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Employee } from './employee';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private API_URL = environment.BASE_API_URL + 'agents/';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL + 'getAllAgents');
  }

  deleteUserProfile(agentId: string): Observable<string> {
    return this.http.delete<string>(this.API_URL + 'deleteAgent/' + agentId);
  }

  updateEmployeeData(agentId: string, value: Employee): Observable<Employee[]> {
    return this.http.put<Employee[]>(
      this.API_URL + 'updateAgent/' + agentId,
      value
    );
  }

  addEmployee(value: Employee) {
    return this.http.post<Employee[]>(this.API_URL + 'addAgent', value);
  }
}
