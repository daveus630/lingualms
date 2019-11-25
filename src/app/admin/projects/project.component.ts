import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { MatTableDataSource, MatPaginator } from '@angular/material';

import { ProjectService } from './project.service';
import { AlertService } from 'src/app/_services/alert.service';
import { UpdateListenerService } from '../../_services/update-listener.service';

import { Project } from './project';

declare var $: any;

@Component({
  templateUrl: 'project.component.html',
  styleUrls: ['project.component.css']
})
export class ProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  displayedColumns: string[] = ['projectName', 'team', 'action'];
  dataSource = new MatTableDataSource<Project>();
  projectList: Project[] = [];
  rowDetail: any = [];
  savedForm = false;
  isLoadingResults = false;
  isLoadingDelete = false;
  isLoadingAdd = false;
  isNoData = true;
  currentIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    public projectService: ProjectService,
    private alertService: AlertService,
    public updateListenerService: UpdateListenerService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.addProjectForm.controls;
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.addProjectForm = this.fb.group({
      name: ['', Validators.required],
      team: ['', Validators.required]
    });
    this.getProjectList();
  }

  getProjectList() {
    this.projectService.getProjects().subscribe(data => {
      this.projectList = data['projects'];
      this.dataSource = new MatTableDataSource<Project>(this.projectList);
      setTimeout(() => (this.dataSource.paginator = this.paginator));
      if (this.dataSource.data.length > 0) {
        this.isNoData = false;
      }
      this.isLoadingResults = false;
    });
  }

  deleteProjectDetails() {
    let team: string;
    let project: string;
    if (this.rowDetail) {
      team = this.rowDetail.team;
      project = this.rowDetail.name;
    }
    this.isLoadingDelete = true;
    this.projectService.deleteProject(team, project).subscribe(
      data => {
        this.isLoadingDelete = false;
        this.deleteRowDataTable(this.dataSource);
        this.alertService.success(data['message'], true);
      },
      error => {
        this.isLoadingDelete = false;
        if (error.status === 404) {
          this.alertService.error('Requested API not found');
        } else {
          this.alertService.error(error.error['message']);
        }
      }
    );
  }

  addProject() {
    // stop here if form is invalid
    if (this.addProjectForm.invalid) {
      return;
    }
    this.isLoadingAdd = true;
    const projectObj = this.addProjectForm.value;
    this.projectService
      .addProject(this.addProjectForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.isLoadingAdd = false;
          this.alertService.success(data['message'], true);
          this.updateListenerService.addUpdateListener(
            projectObj,
            this.dataSource
          );
        },
        error => {
          this.isLoadingAdd = false;
          if (error.status === 404) {
            this.alertService.error('Requested API not found');
          } else {
            this.alertService.error(error.error['message']);
          }
        }
      );
    this.reset();
    $('#addProjectModal').modal('hide');
  }

  reset() {
    this.addProjectForm.reset({
      name: '',
      team: ''
    });
  }

  getRecord(value: Project, index: number) {
    this.currentIndex = index;
    this.rowDetail = value;
    return this.rowDetail;
  }

  deleteRowDataTable(dataSource) {
    console.log('deleteRow', this.currentIndex);
    dataSource.data.splice(this.currentIndex, 1);
    dataSource._updateChangeSubscription();
    if (dataSource.data.length <= 0) {
      this.isNoData = true;
    }
  }
}
