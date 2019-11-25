import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { MatPaginator, MatTableDataSource } from '@angular/material';

import { AlertService } from '../../../_services/alert.service';
import { SupervisorService } from '../../supervisors/supervisor.service';
import { ProjectService } from '../../projects/project.service';
import { EmployeeService } from '../employee.service';

import { Employee } from '../employee';
import { Supervisor } from '../../supervisors/supervisor';

import * as _ from 'lodash';

declare var $: any;

@Component({
  selector: 'app-modify-employee',
  templateUrl: 'modify-employee.component.html',
  styleUrls: ['modify-employee.component.css']
})
export class ModifyEmployeeComponent implements OnInit {
  updateEmployeeForm: FormGroup;
  displayedColumns: string[] = [
    'employeeName',
    'phone',
    'project',
    'team',
    'role',
    'shift',
    'supervisor',
    'action'
  ];
  dataSource = new MatTableDataSource();
  employeesData: Employee[] = [];
  rowDetail: any = [];
  agentId: string;
  editAgentId: string;
  roles = ['User', 'Admin'];
  shiftSchedules = ['APAC', 'EMEA', 'MTV'];
  isLoadingResults = false;
  isLoading = false;
  isNoData = true;
  projectLists: any[] = [];
  teamLists: any[] = [];
  supervisors: Supervisor[] = [];
  currentIndex = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public employeeService: EmployeeService,
    public alertService: AlertService,
    public fb: FormBuilder,
    public supervisorService: SupervisorService,
    public projectService: ProjectService
  ) {}

  ngOnInit() {
    this.isLoadingResults = true;
    this.getProjects();
    this.getSupervisors();
    this.employeeService.getAllEmployees().subscribe(data => {
      this.employeesData = data['data'];
      this.employeesData.sort((a, b) => (a.name > b.name ? 1 : -1));
      this.dataSource = new MatTableDataSource(this.employeesData);
      setTimeout(() => (this.dataSource.paginator = this.paginator));
      if (this.dataSource.data.length > 0) {
        this.isNoData = false;
      }
      this.isLoadingResults = false;
    });

    this.updateEmployeeForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      role: ['User'],
      project: ['selectProject'],
      team: ['selectTeam'],
      shift: ['selectShift'],
      supervisor: ['selectOptions']
    });
  }

  editEmployeeDetails(
    name: string,
    email: string,
    phone: string,
    project: string,
    team: string,
    role: string,
    shift: string,
    supervisor: string
  ) {
    $('#editEmployeeModal').modal('show');
    this.editAgentId = email.split('@')[0];
    this.updateEmployeeForm.get('name').setValue(name);
    this.updateEmployeeForm.get('email').setValue(email);
    this.updateEmployeeForm.get('phone').setValue(phone);
    this.updateEmployeeForm.get('role').setValue(role);
    this.updateEmployeeForm.get('project').setValue(project);
    this.updateEmployeeForm.get('team').setValue(team);
    this.updateEmployeeForm.get('shift').setValue(shift);
    this.updateEmployeeForm.get('supervisor').setValue(supervisor);
  }

  updateEmployeeDetails() {
    this.isLoading = true;
    this.employeeService
      .updateEmployeeData(this.editAgentId, this.updateEmployeeForm.value)
      .subscribe(
        data => {
          this.dataSource.data[
            this.currentIndex
          ] = this.updateEmployeeForm.value;
          setTimeout(() => (this.dataSource.paginator = this.paginator));
          this.isLoading = false;
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

  deleteEmployeeDetails() {
    if (this.rowDetail) {
      this.agentId = this.rowDetail.email.split('@')[0];
    }
    this.isLoading = true;
    this.employeeService.deleteUserProfile(this.agentId).subscribe(
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

  getProjects() {
    this.projectService.getProjects().subscribe(data => {
      const projectData = data['projects'];
      const projectNameList = _.map(projectData, 'name');
      this.projectLists = _.uniqBy(projectNameList);
      this.teamLists = _.map(projectData, 'team');
    });
  }

  getSupervisors() {
    this.supervisorService.getSupervisors().subscribe(data => {
      this.supervisors = data['supervisors'];
    });
  }

  getRecord(value: Employee, index: number) {
    this.currentIndex = index;
    this.rowDetail = value;
    return this.rowDetail;
  }

  deleteRowDataTable(dataSource) {
    dataSource.data.splice(this.currentIndex, 1);
    setTimeout(() => (this.dataSource.paginator = this.paginator));
    if (dataSource.data.length <= 0) {
      this.isNoData = true;
    }
  }
}
