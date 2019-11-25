import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Project } from './project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private API_URL = environment.BASE_API_URL + 'projects/';
  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.API_URL + 'getAllProjects');
  }

  deleteProject(teamName: string, projectName: string): Observable<string> {
    const params = new HttpParams()
      .set('team', teamName)
      .set('project', projectName);
    return this.http.delete<string>(this.API_URL + 'delete', { params });
  }

  addProject(value: Project) {
    return this.http.post<Project[]>(this.API_URL + 'addProject', value);
  }
}
